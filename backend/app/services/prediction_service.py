import os
import numpy as np
import torch
import joblib
import json
from transformers import BertTokenizer, BertModel
from torchvision import transforms
from PIL import Image
import requests
from io import BytesIO
import re
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
            conn_str = (
                "DRIVER={ODBC Driver 17 for SQL Server};"
                "SERVER=LAPTOP-58649FBF;"
                "DATABASE=prepost_analytics;"
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
