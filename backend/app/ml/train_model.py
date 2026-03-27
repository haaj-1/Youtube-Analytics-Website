import os
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertModel
from torchvision import models, transforms
from torchvision.models import ResNet18_Weights
from PIL import Image
import requests
from io import BytesIO
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import pyodbc
from datetime import datetime
import os
import warnings

# Suppress specific warnings
warnings.filterwarnings('ignore', category=FutureWarning, module='huggingface_hub')
warnings.filterwarnings('ignore', category=UserWarning, module='transformers')

# Database connection
def get_db_connection():
    """Get database connection from environment variable"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise Exception("DATABASE_URL environment variable not found")
    
    # Parse the DATABASE_URL to extract server and database name
    # Format: mssql+pyodbc://SERVER/DATABASE?driver=...
    parts = database_url.split('/')
    server = parts[2]
    db_parts = parts[3].split('?')
    database = db_parts[0]
    
    conn_str = (
        "DRIVER={ODBC Driver 17 for SQL Server};"
        f"SERVER={server};"
        f"DATABASE={database};"
        "Trusted_Connection=yes;"
    )
    return pyodbc.connect(conn_str)

# Load data from database
def load_data():
    print("Loading data from database...")
    conn = get_db_connection()
    query = """
        SELECT video_id, video_title as title, video_description as description, 
               video_default_thumbnail as thumbnail_url, video_category_id as category_id,
               channel_subscriber_count as subscriber_count, subscriber_range, 
               video_view_count as view_count, video_like_count as like_count, 
               video_comment_count as comment_count, engagement_rate, duration_seconds,
               video_published_at as published_at
        FROM ml.videos_dataset
        WHERE channel_subscriber_count IS NOT NULL AND channel_subscriber_count > 0
    """
    df = pd.read_sql(query, conn)
    conn.close()
    print(f"Loaded {len(df)} videos")
    return df

# CNN for thumbnail feature extraction
class ThumbnailCNN(nn.Module):
    def __init__(self, embedding_dim=512):
        super(ThumbnailCNN, self).__init__()
        # Use pre-trained ResNet18 with new weights syntax
        resnet = models.resnet18(weights=ResNet18_Weights.IMAGENET1K_V1)
        # Remove final classification layer
        self.features = nn.Sequential(*list(resnet.children())[:-1])
        # Add custom embedding layer
        self.embedding = nn.Linear(512, embedding_dim)
        
    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.embedding(x)
        return x

# BERT for text feature extraction
class TextBERT:
    def __init__(self, max_length=128):
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.model = BertModel.from_pretrained('bert-base-uncased')
        self.max_length = max_length
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        self.model.eval()
        
    def encode(self, texts):
        embeddings = []
        for text in texts:
            inputs = self.tokenizer(text, return_tensors='pt', max_length=self.max_length,
                                   truncation=True, padding='max_length')
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                # Use [CLS] token embedding
                embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()
                embeddings.append(embedding[0])
        
        return np.array(embeddings)

# Thumbnail feature extractor
class ThumbnailFeatureExtractor:
    def __init__(self, embedding_dim=512):
        self.model = ThumbnailCNN(embedding_dim)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def download_image(self, url):
        try:
            response = requests.get(url, timeout=10)
            img = Image.open(BytesIO(response.content)).convert('RGB')
            return img
        except Exception as e:
            print(f"Error downloading image: {e}")
            return None
    
    def extract_features(self, image_urls):
        features = []
        for i, url in enumerate(image_urls):
            if i % 50 == 0:
                print(f"Processing thumbnail {i}/{len(image_urls)}")
            
            img = self.download_image(url)
            if img is None:
                # Use zero vector for failed downloads
                features.append(np.zeros(512))
                continue
            
            img_tensor = self.transform(img).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                embedding = self.model(img_tensor).cpu().numpy()[0]
                features.append(embedding)
        
        return np.array(features)

# Main training pipeline
def train_model():
    print("=" * 50)
    print("YouTube Video Performance Prediction - ML Training")
    print("=" * 50)
    
    # Load data
    df = load_data()
    
    # Remove outliers (top 1% views)
    view_threshold = df['view_count'].quantile(0.99)
    df = df[df['view_count'] <= view_threshold]
    
    print(f"\nDataset after outlier removal: {len(df)} videos")
    print(f"View count range: {df['view_count'].min():,.0f} - {df['view_count'].max():,.0f}")
    
    # Extract text features with BERT
    print("\n[1/4] Extracting text features with BERT...")
    text_encoder = TextBERT()
    df['combined_text'] = df['title'] + " " + df['description'].fillna("")
    text_features = text_encoder.encode(df['combined_text'].tolist())
    print(f"Text features shape: {text_features.shape}")
    
    # Extract thumbnail features with CNN
    print("\n[2/4] Extracting thumbnail features with CNN...")
    thumbnail_extractor = ThumbnailFeatureExtractor()
    thumbnail_features = thumbnail_extractor.extract_features(df['thumbnail_url'].tolist())
    print(f"Thumbnail features shape: {thumbnail_features.shape}")
    
    # Prepare categorical and numerical features
    print("\n[3/4] Preparing features...")
    
    # Encode categories
    category_encoder = LabelEncoder()
    df['category_encoded'] = category_encoder.fit_transform(df['category_id'])
    
    subscriber_encoder = LabelEncoder()
    df['subscriber_range_encoded'] = subscriber_encoder.fit_transform(df['subscriber_range'])
    
    # Feature engineering - engagement ratios
    df['like_rate'] = df['like_count'] / (df['view_count'] + 1)
    df['comment_rate'] = df['comment_count'] / (df['view_count'] + 1)
    df['views_per_subscriber'] = df['view_count'] / (df['subscriber_count'] + 1)
    df['log_subscribers'] = np.log1p(df['subscriber_count'])
    df['log_duration'] = np.log1p(df['duration_seconds'])
    
    # Temporal features (if published_at exists)
    if 'published_at' in df.columns and df['published_at'].notna().any():
        df['published_at'] = pd.to_datetime(df['published_at'])
        df['publish_hour'] = df['published_at'].dt.hour
        df['publish_day_of_week'] = df['published_at'].dt.dayofweek  # 0=Monday, 6=Sunday
        df['publish_month'] = df['published_at'].dt.month
        df['is_weekend'] = (df['publish_day_of_week'] >= 5).astype(int)
        
        # Cyclical encoding for hour (24-hour cycle)
        df['hour_sin'] = np.sin(2 * np.pi * df['publish_hour'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['publish_hour'] / 24)
        
        # Cyclical encoding for day of week (7-day cycle)
        df['day_sin'] = np.sin(2 * np.pi * df['publish_day_of_week'] / 7)
        df['day_cos'] = np.cos(2 * np.pi * df['publish_day_of_week'] / 7)
        
        temporal_cols = ['hour_sin', 'hour_cos', 'day_sin', 'day_cos', 'publish_month', 'is_weekend']
        print(f"Added {len(temporal_cols)} temporal features")
    else:
        temporal_cols = []
        print("No temporal features (published_at not available)")
    
    # Numerical features
    base_features = ['log_subscribers', 'log_duration', 'engagement_rate',
                     'like_rate', 'comment_rate', 'views_per_subscriber',
                     'category_encoded', 'subscriber_range_encoded']
    numerical_features = df[base_features + temporal_cols].values
    
    # Normalize numerical features
    scaler = StandardScaler()
    numerical_features = scaler.fit_transform(numerical_features)
    
    # Combine all features
    X = np.concatenate([text_features, thumbnail_features, numerical_features], axis=1)
    y = np.log1p(df['view_count'].values)  # Log transform target
    
    print(f"Final feature shape: {X.shape}")
    print(f"Target shape: {y.shape}")
    
    # Train-validation-test split (70/15/15)
    X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.176, random_state=42)  # 0.176 * 0.85 ≈ 0.15
    
    print(f"\nDataset splits:")
    print(f"  Training: {len(X_train)} samples ({len(X_train)/len(X)*100:.1f}%)")
    print(f"  Validation: {len(X_val)} samples ({len(X_val)/len(X)*100:.1f}%)")
    print(f"  Test: {len(X_test)} samples ({len(X_test)/len(X)*100:.1f}%)")
    
    # Train XGBoost model with regularization
    print("\n[4/4] Training XGBoost model...")
    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_alpha=0.5,
        reg_lambda=0.5,
        min_child_weight=3,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train, 
             eval_set=[(X_train, y_train), (X_val, y_val)],
             early_stopping_rounds=20,
             verbose=True)
    
    # Evaluate
    print("\n" + "=" * 50)
    print("Model Evaluation")
    print("=" * 50)
    
    y_pred_train = model.predict(X_train)
    y_pred_val = model.predict(X_val)
    y_pred_test = model.predict(X_test)
    
    # Convert back from log scale
    y_train_actual = np.expm1(y_train)
    y_val_actual = np.expm1(y_val)
    y_test_actual = np.expm1(y_test)
    y_pred_train_actual = np.expm1(y_pred_train)
    y_pred_val_actual = np.expm1(y_pred_val)
    y_pred_test_actual = np.expm1(y_pred_test)
    
    print("\nTraining Set:")
    print(f"  R² Score: {r2_score(y_train_actual, y_pred_train_actual):.4f}")
    print(f"  RMSE: {np.sqrt(mean_squared_error(y_train_actual, y_pred_train_actual)):,.0f}")
    print(f"  MAE: {mean_absolute_error(y_train_actual, y_pred_train_actual):,.0f}")
    
    print("\nValidation Set:")
    print(f"  R² Score: {r2_score(y_val_actual, y_pred_val_actual):.4f}")
    print(f"  RMSE: {np.sqrt(mean_squared_error(y_val_actual, y_pred_val_actual)):,.0f}")
    print(f"  MAE: {mean_absolute_error(y_val_actual, y_pred_val_actual):,.0f}")
    
    print("\nTest Set:")
    print(f"  R² Score: {r2_score(y_test_actual, y_pred_test_actual):.4f}")
    print(f"  RMSE: {np.sqrt(mean_squared_error(y_test_actual, y_pred_test_actual)):,.0f}")
    print(f"  MAE: {mean_absolute_error(y_test_actual, y_pred_test_actual):,.0f}")
    
    # Save models
    print("\n" + "=" * 50)
    print("Saving Models")
    print("=" * 50)
    
    os.makedirs('backend/app/ml/models', exist_ok=True)
    
    # Save XGBoost model
    model.save_model('backend/app/ml/models/xgboost_model.json')
    print("✓ Saved XGBoost model")
    
    # Save encoders and scaler
    joblib.dump(category_encoder, 'backend/app/ml/models/category_encoder.pkl')
    joblib.dump(subscriber_encoder, 'backend/app/ml/models/subscriber_encoder.pkl')
    joblib.dump(scaler, 'backend/app/ml/models/scaler.pkl')
    print("✓ Saved encoders and scaler")
    
    # Save CNN model
    torch.save(thumbnail_extractor.model.state_dict(), 'backend/app/ml/models/thumbnail_cnn.pth')
    print("✓ Saved CNN model")
    
    # Save metadata
    metadata = {
        'trained_at': datetime.now().isoformat(),
        'n_samples': len(df),
        'n_features': X.shape[1],
        'test_r2': float(r2_score(y_test_actual, y_pred_test_actual)),
        'test_rmse': float(np.sqrt(mean_squared_error(y_test_actual, y_pred_test_actual))),
        'val_r2': float(r2_score(y_val_actual, y_pred_val_actual)),
        'val_rmse': float(np.sqrt(mean_squared_error(y_val_actual, y_pred_val_actual))),
        'categories': category_encoder.classes_.tolist(),
        'subscriber_ranges': subscriber_encoder.classes_.tolist()
    }
    
    import json
    with open('backend/app/ml/models/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    print("✓ Saved metadata")
    
    print("\n" + "=" * 50)
    print("Training Complete!")
    print("=" * 50)
    print(f"\nModels saved to: backend/app/ml/models/")
    print(f"Ready for predictions!")

if __name__ == "__main__":
    train_model()
