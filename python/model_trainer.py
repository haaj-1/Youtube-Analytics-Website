# python/model_trainer.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import joblib
from transformers import BertTokenizer, BertModel
import torch

class YouTubeMLTrainer:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.bert_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.bert_model = BertModel.from_pretrained('bert-base-uncased')
        
    def load_data(self, csv_path):
        """Load training data from CSV"""
        df = pd.read_csv(csv_path)
        
        # Clean data
        df = df.dropna(subset=['title', 'view_count'])
        df = df[df['view_count'] > 0]  # Remove videos with 0 views
        
        return df
    
    def extract_bert_features(self, texts, max_length=128):
        """Extract BERT embeddings from text"""
        embeddings = []
        
        for text in texts:
            if pd.isna(text):
                text = ""
            
            inputs = self.bert_tokenizer(
                str(text), 
                return_tensors='pt', 
                max_length=max_length, 
                truncation=True, 
                padding=True
            )
            
            with torch.no_grad():
                outputs = self.bert_model(**inputs)
                # Use mean pooling of last hidden state
                embedding = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
                embeddings.append(embedding)
        
        return np.array(embeddings)
    
    def engineer_features(self, df):
        """Create features for ML model"""
        features_df = df.copy()
        
        # Time-based features
        features_df['published_at'] = pd.to_datetime(features_df['published_at'])
        features_df['hour'] = features_df['published_at'].dt.hour
        features_df['day_of_week'] = features_df['published_at'].dt.dayofweek
        features_df['month'] = features_df['published_at'].dt.month
        
        # Text features
        features_df['title_word_count'] = features_df['title'].str.split().str.len()
        features_df['title_char_count'] = features_df['title'].str.len()
        features_df['has_question_mark'] = features_df['title'].str.contains('?').astype(int)
        features_df['has_exclamation'] = features_df['title'].str.contains('!').astype(int)
        features_df['title_uppercase_ratio'] = features_df['title'].apply(
            lambda x: sum(1 for c in str(x) if c.isupper()) / len(str(x)) if len(str(x)) > 0 else 0
        )
        
        # Duration features
        features_df['duration_minutes'] = features_df['duration_seconds'] / 60
        features_df['is_short_video'] = (features_df['duration_seconds'] < 60).astype(int)
        features_df['is_long_video'] = (features_df['duration_seconds'] > 600).astype(int)
        
        # Engagement features
        features_df['like_to_view_ratio'] = features_df['like_count'] / (features_df['view_count'] + 1)
        features_df['comment_to_view_ratio'] = features_df['comment_count'] / (features_df['view_count'] + 1)
        
        return features_df
    
    def prepare_training_data(self, df):
        """Prepare data for training"""
        # Engineer features
        df_features = self.engineer_features(df)
        
        # Extract BERT features for titles
        print("Extracting BERT features...")
        title_embeddings = self.extract_bert_features(df_features['title'].tolist())
        
        # Combine all features
        feature_columns = [
            'title_length', 'description_length', 'tags_count', 'duration_seconds',
            'hour', 'day_of_week', 'month', 'title_word_count', 'title_char_count',
            'has_question_mark', 'has_exclamation', 'title_uppercase_ratio',
            'duration_minutes', 'is_short_video', 'is_long_video'
        ]
        
        # Handle categorical variables
        if 'category_id' in df_features.columns:
            le = LabelEncoder()
            df_features['category_encoded'] = le.fit_transform(df_features['category_id'].fillna('0'))
            feature_columns.append('category_encoded')
            self.encoders['category'] = le
        
        # Combine numerical features with BERT embeddings
        numerical_features = df_features[feature_columns].fillna(0).values
        all_features = np.hstack([numerical_features, title_embeddings])
        
        return all_features, df_features
    
    def train_models(self, csv_path):
        """Train ML models for different targets"""
        print("Loading data...")
        df = self.load_data(csv_path)
        
        print("Preparing features...")
        X, df_features = self.prepare_training_data(df)
        
        # Define targets
        targets = {
            'views': 'view_count',
            'likes': 'like_count', 
            'comments': 'comment_count',
            'engagement': 'engagement_rate'
        }
        
        results = {}
        
        for target_name, target_col in targets.items():
            print(f"\nTraining {target_name} model...")
            
            y = df_features[target_col].values
            
            # Log transform for view counts (they're highly skewed)
            if target_name in ['views', 'likes', 'comments']:
                y = np.log1p(y)  # log(1 + x) to handle zeros
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train model
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            model.fit(X_train_scaled, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test_scaled)
            
            # Transform back if log-transformed
            if target_name in ['views', 'likes', 'comments']:
                y_test_orig = np.expm1(y_test)
                y_pred_orig = np.expm1(y_pred)
            else:
                y_test_orig = y_test
                y_pred_orig = y_pred
            
            mae = mean_absolute_error(y_test_orig, y_pred_orig)
            rmse = np.sqrt(mean_squared_error(y_test_orig, y_pred_orig))
            r2 = r2_score(y_test_orig, y_pred_orig)
            
            results[target_name] = {
                'mae': mae,
                'rmse': rmse,
                'r2': r2
            }
            
            # Save model and scaler
            self.models[target_name] = model
            self.scalers[target_name] = scaler
            
            print(f"{target_name} - MAE: {mae:.2f}, RMSE: {rmse:.2f}, R²: {r2:.3f}")
        
        # Save all models
        self.save_models()
        
        return results
    
    def save_models(self):
        """Save trained models"""
        joblib.dump(self.models, 'models/youtube_models.pkl')
        joblib.dump(self.scalers, 'models/youtube_scalers.pkl')
        joblib.dump(self.encoders, 'models/youtube_encoders.pkl')
        print("Models saved successfully!")
    
    def load_models(self):
        """Load trained models"""
        self.models = joblib.load('models/youtube_models.pkl')
        self.scalers = joblib.load('models/youtube_scalers.pkl')
        self.encoders = joblib.load('models/youtube_encoders.pkl')
        print("Models loaded successfully!")

# Usage
if __name__ == "__main__":
    trainer = YouTubeMLTrainer()
    
    # Train models
    results = trainer.train_models('youtube_training_data.csv')
    
    print("\nTraining completed!")
    print("Model performance:")
    for target, metrics in results.items():
        print(f"{target}: MAE={metrics['mae']:.2f}, RMSE={metrics['rmse']:.2f}, R²={metrics['r2']:.3f}")