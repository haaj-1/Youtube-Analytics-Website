import os
import numpy as np
import torch
import joblib
import json
import re
from transformers import BertTokenizer, BertModel
from torchvision import transforms
from PIL import Image
import requests
from io import BytesIO
import pyodbc

class PredictionService:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_dir = os.path.join(base_dir, "ml", "models")
        self.models_loaded = False
        
    def load_models(self):
        """Load all trained models"""
        if self.models_loaded:
            return
        
        print(f"Loading models from: {self.model_dir}")
        print(f"Files in directory: {os.listdir(self.model_dir)}")
            
        # Load XGBoost model
        import xgboost as xgb
        self.xgb_model = xgb.XGBRegressor()
        self.xgb_model.load_model(os.path.join(self.model_dir, "xgboost_model.json"))
        
        # Load encoders and scaler
        category_path = os.path.join(self.model_dir, "category_encoder.pkl")
        subscriber_path = os.path.join(self.model_dir, "subscriber_encoder.pkl")
        scaler_path = os.path.join(self.model_dir, "scaler.pkl")
        
        self.category_encoder = joblib.load(open(category_path, "rb"))
        self.subscriber_encoder = joblib.load(open(subscriber_path, "rb"))
        self.scaler = joblib.load(open(scaler_path, "rb"))
        
        # Load metadata
        with open(os.path.join(self.model_dir, "metadata.json"), "r") as f:
            self.metadata = json.load(f)
        
        # Load BERT
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.bert_model = BertModel.from_pretrained('bert-base-uncased')
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.bert_model.to(self.device)
        self.bert_model.eval()
        
        # Load CNN
        from app.ml.train_model import ThumbnailCNN
        self.cnn_model = ThumbnailCNN(embedding_dim=512)
        self.cnn_model.load_state_dict(torch.load(os.path.join(self.model_dir, "thumbnail_cnn.pth")))
        self.cnn_model.to(self.device)
        self.cnn_model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        self.models_loaded = True
    
    def get_subscriber_range(self, count):
        """Map subscriber count to range"""
        if count < 1000:
            return '0-1K'
        elif count < 10000:
            return '1K-10K'
        elif count < 50000:
            return '10K-50K'
        elif count < 100000:
            return '50K-100K'
        elif count < 250000:
            return '100K-250K'
        elif count < 500000:
            return '250K-500K'
        elif count < 1000000:
            return '500K-1M'
        elif count < 10000000:
            return '1M-10M'
        else:
            return '10M+'
    
    def extract_text_features(self, text):
        """Extract BERT features from text"""
        inputs = self.tokenizer(text, return_tensors='pt', max_length=128,
                               truncation=True, padding='max_length')
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.bert_model(**inputs)
            embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()
        
        return embedding[0]
    
    def extract_thumbnail_features(self, image_url):
        """Extract CNN features from thumbnail URL or base64"""
        try:
            # Check if base64 image
            if image_url.startswith('data:image'):
                import base64
                image_data = image_url.split(',')[1]
                img_bytes = base64.b64decode(image_data)
                img = Image.open(BytesIO(img_bytes)).convert('RGB')
            else:
                response = requests.get(image_url, timeout=10)
                img = Image.open(BytesIO(response.content)).convert('RGB')
        except:
            return np.zeros(512)
        
        img_tensor = self.transform(img).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            embedding = self.cnn_model(img_tensor).cpu().numpy()[0]
        
        return embedding
    
    def predict_performance(self, title, description, thumbnail_url, category_id, 
                          subscriber_count, duration_seconds, publish_datetime=None):
        """Predict video performance with recommendations"""
        self.load_models()
        
        # Extract features
        combined_text = f"{title} {description}"
        text_features = self.extract_text_features(combined_text)
        thumbnail_features = self.extract_thumbnail_features(thumbnail_url)
        
        # Prepare numerical features
        subscriber_range = self.get_subscriber_range(subscriber_count)
        category_encoded = self.category_encoder.transform([category_id])[0]
        subscriber_range_encoded = self.subscriber_encoder.transform([subscriber_range])[0]
        
        log_subscribers = np.log1p(subscriber_count)
        log_duration = np.log1p(duration_seconds)
        
        # Temporal features (use current time if not provided)
        if publish_datetime is None:
            from datetime import datetime
            publish_datetime = datetime.now()
        
        hour = publish_datetime.hour
        day_of_week = publish_datetime.weekday()
        month = publish_datetime.month
        is_weekend = 1 if day_of_week >= 5 else 0
        
        hour_sin = np.sin(2 * np.pi * hour / 24)
        hour_cos = np.cos(2 * np.pi * hour / 24)
        day_sin = np.sin(2 * np.pi * day_of_week / 7)
        day_cos = np.cos(2 * np.pi * day_of_week / 7)
        
        numerical_features = np.array([
            log_subscribers, log_duration, 0.02, 0.03, 0.005, 0.1,
            category_encoded, subscriber_range_encoded,
            hour_sin, hour_cos, day_sin, day_cos, month, is_weekend
        ])
        
        numerical_features = self.scaler.transform(numerical_features.reshape(1, -1))[0]
        X = np.concatenate([text_features, thumbnail_features, numerical_features])
        
        log_views = self.xgb_model.predict(X.reshape(1, -1))[0]
        predicted_views = int(np.expm1(log_views))
        confidence = self.metadata.get('test_r2', 0.5)
        
        recommendations = self._generate_recommendations(
            title, description, category_id, subscriber_count, 
            duration_seconds, predicted_views
        )
        
        return {
            'predicted_views': predicted_views,
            'confidence_score': round(confidence, 2),
            'subscriber_range': subscriber_range,
            'category_id': category_id,
            'recommendations': recommendations
        }
    
    def _generate_recommendations(self, title, description, category_id, 
                                 subscriber_count, duration_seconds, predicted_views):
        """Generate data-driven recommendations only"""
        recommendations = []
        
        # Only benchmark comparison - data-driven
        try:
            database_url = os.getenv('DATABASE_URL')
            if not database_url:
                raise Exception("Database configuration not found")
            
            # Parse the DATABASE_URL to extract server and database name
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
            conn = pyodbc.connect(conn_str)
            cursor = conn.cursor()
            
            subscriber_range = self.get_subscriber_range(subscriber_count)
            
            cursor.execute("""
                SELECT 
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CAST(video_view_count AS FLOAT)) OVER () as median_views
                FROM ml.videos_dataset
                WHERE video_category_id = ?
                AND subscriber_range = ?
            """, (category_id, subscriber_range))
            
            row = cursor.fetchone()
            category_median = int(row[0]) if row and row[0] else None
            conn.close()
            
            if category_median and predicted_views < category_median * 0.5:
                recommendations.append({
                    'type': 'warning',
                    'category': 'Performance',
                    'message': f'Predicted views ({predicted_views:,}) are below typical for your channel size',
                    'action': 'Consider optimizing title and thumbnail'
                })
            elif category_median and predicted_views > category_median * 2:
                recommendations.append({
                    'type': 'success',
                    'category': 'Performance',
                    'message': f'Excellent! Predicted views are {int((predicted_views/category_median - 1)*100)}% above typical',
                    'action': 'This content strategy is working well'
                })
        except:
            pass
        
        return recommendations

    def train_personalized_model(self, videos, channel_info):
        """Train a personalized model based on user's channel history"""
        self.load_models()
        
        if len(videos) < 5:
            raise ValueError("Need at least 5 videos to train personalized model")
        
        # Extract features from all videos
        X_list = []
        y_list = []
        
        for video in videos:
            try:
                title = video['snippet']['title']
                description = video['snippet']['description']
                thumbnail_url = video['snippet']['thumbnails'].get('high', {}).get('url', 
                               video['snippet']['thumbnails']['default']['url'])
                category_id = int(video['snippet']['categoryId'])
                view_count = int(video['statistics']['viewCount'])
                
                # Parse duration
                duration = video['contentDetails']['duration']
                match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
                hours = int(match.group(1) or 0)
                minutes = int(match.group(2) or 0)
                seconds = int(match.group(3) or 0)
                duration_seconds = hours * 3600 + minutes * 60 + seconds
                
                # Extract features
                combined_text = f"{title} {description}"
                text_features = self.extract_text_features(combined_text)
                thumbnail_features = self.extract_thumbnail_features(thumbnail_url)
                
                subscriber_count = channel_info['subscriber_count']
                subscriber_range = self.get_subscriber_range(subscriber_count)
                category_encoded = self.category_encoder.transform([category_id])[0]
                subscriber_range_encoded = self.subscriber_encoder.transform([subscriber_range])[0]
                
                log_subscribers = np.log1p(subscriber_count)
                log_duration = np.log1p(duration_seconds)
                
                # Use average temporal features
                numerical_features = np.array([
                    log_subscribers, log_duration, 0.02, 0.03, 0.005, 0.1,
                    category_encoded, subscriber_range_encoded,
                    0, 0, 0, 0, 6, 0  # Average temporal features
                ])
                
                numerical_features = self.scaler.transform(numerical_features.reshape(1, -1))[0]
                X = np.concatenate([text_features, thumbnail_features, numerical_features])
                
                X_list.append(X)
                y_list.append(np.log1p(view_count))
                
            except Exception as e:
                print(f"Error processing video: {e}")
                continue
        
        if len(X_list) < 5:
            raise ValueError("Not enough valid videos to train model")
        
        X_train = np.array(X_list)
        y_train = np.array(y_list)
        
        # Train a new XGBoost model on user's data
        import xgboost as xgb
        self.personalized_model = xgb.XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        self.personalized_model.fit(X_train, y_train)
        
        # Calculate personalized statistics
        predictions = self.personalized_model.predict(X_train)
        actual_views = [int(np.expm1(y)) for y in y_train]
        predicted_views = [int(np.expm1(p)) for p in predictions]
        
        # Calculate metrics
        from sklearn.metrics import r2_score, mean_absolute_percentage_error
        r2 = r2_score(y_train, predictions)
        mape = mean_absolute_percentage_error(actual_views, predicted_views)
        
        avg_views = np.mean(actual_views)
        median_views = np.median(actual_views)
        
        self.personalized_stats = {
            'videos_analyzed': len(videos),
            'r2_score': float(r2),
            'mape': float(mape),
            'avg_views': int(avg_views),
            'median_views': int(median_views),
            'channel_name': channel_info['title'],
            'subscriber_count': channel_info['subscriber_count']
        }
        
        return {
            'success': True,
            'message': f'Personalized model trained on {len(X_list)} videos',
            'stats': self.personalized_stats,
            'model_accuracy': f'{r2*100:.1f}%'
        }
    
    def predict_with_personalized_model(self, title, description, thumbnail_url, 
                                       category_id, subscriber_count, duration_seconds):
        """Predict using personalized model"""
        if not hasattr(self, 'personalized_model'):
            raise ValueError("No personalized model available. Train one first.")
        
        self.load_models()
        
        # Extract features (same as regular prediction)
        combined_text = f"{title} {description}"
        text_features = self.extract_text_features(combined_text)
        thumbnail_features = self.extract_thumbnail_features(thumbnail_url)
        
        subscriber_range = self.get_subscriber_range(subscriber_count)
        category_encoded = self.category_encoder.transform([category_id])[0]
        subscriber_range_encoded = self.subscriber_encoder.transform([subscriber_range])[0]
        
        log_subscribers = np.log1p(subscriber_count)
        log_duration = np.log1p(duration_seconds)
        
        numerical_features = np.array([
            log_subscribers, log_duration, 0.02, 0.03, 0.005, 0.1,
            category_encoded, subscriber_range_encoded,
            0, 0, 0, 0, 6, 0
        ])
        
        numerical_features = self.scaler.transform(numerical_features.reshape(1, -1))[0]
        X = np.concatenate([text_features, thumbnail_features, numerical_features])
        
        # Use personalized model
        log_views = self.personalized_model.predict(X.reshape(1, -1))[0]
        predicted_views = int(np.expm1(log_views))
        
        # Compare with channel average
        comparison = {
            'vs_channel_avg': f"{((predicted_views / self.personalized_stats['avg_views']) - 1) * 100:+.1f}%",
            'vs_channel_median': f"{((predicted_views / self.personalized_stats['median_views']) - 1) * 100:+.1f}%"
        }
        
        return {
            'predicted_views': predicted_views,
            'confidence_score': round(self.personalized_stats['r2_score'], 2),
            'subscriber_range': subscriber_range,
            'category_id': category_id,
            'model_type': 'personalized',
            'channel_stats': self.personalized_stats,
            'comparison': comparison,
            'recommendations': self._generate_personalized_recommendations(
                predicted_views, self.personalized_stats
            )
        }
    
    def _generate_personalized_recommendations(self, predicted_views, stats):
        """Generate recommendations based on channel's own performance"""
        recommendations = []
        
        avg_views = stats['avg_views']
        median_views = stats['median_views']
        
        if predicted_views > avg_views * 1.5:
            recommendations.append({
                'type': 'success',
                'category': 'Performance',
                'message': f'Predicted to perform {((predicted_views/avg_views - 1)*100):.0f}% above your channel average!',
                'action': 'This content strategy aligns well with your audience'
            })
        elif predicted_views < avg_views * 0.5:
            recommendations.append({
                'type': 'warning',
                'category': 'Performance',
                'message': f'Predicted to perform {((1 - predicted_views/avg_views)*100):.0f}% below your channel average',
                'action': 'Consider adjusting title, thumbnail, or topic to match your successful videos'
            })
        else:
            recommendations.append({
                'type': 'tip',
                'category': 'Performance',
                'message': 'Predicted to perform near your channel average',
                'action': 'Solid content - consider A/B testing thumbnail for better results'
            })
        
        return recommendations
