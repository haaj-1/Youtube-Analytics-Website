import torch
from transformers import AutoTokenizer, AutoModel
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from app.models.schemas import VideoData, PredictionResponse, CaptionAnalysisResponse

class MLService:
    def __init__(self):
        self.bert_tokenizer = None
        self.bert_model = None
        self.prediction_model = None
        self.load_models()
    
    def load_models(self):
        """Load BERT and prediction models"""
        try:
            # Load BERT for caption analysis
            self.bert_tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
            self.bert_model = AutoModel.from_pretrained('bert-base-uncased')
            
            # Load trained prediction model (if exists)
            model_path = "./models/prediction_model.joblib"
            if os.path.exists(model_path):
                self.prediction_model = joblib.load(model_path)
            else:
                # Create dummy model for now
                self.prediction_model = RandomForestRegressor(n_estimators=100)
                
        except Exception as e:
            print(f"Error loading models: {e}")
    
    async def predict_performance(self, video_data: VideoData) -> PredictionResponse:
        """Predict video performance metrics"""
        try:
            # Extract features
            features = self._extract_features(video_data)
            
            # Make predictions (dummy values for now)
            predicted_likes = int(np.random.randint(100, 10000))
            predicted_comments = int(np.random.randint(10, 1000))
            predicted_engagement = predicted_likes + predicted_comments
            predicted_impressions = int(predicted_engagement * np.random.uniform(10, 50))
            predicted_reach = int(predicted_impressions * np.random.uniform(0.3, 0.8))
            predicted_saves = int(predicted_likes * np.random.uniform(0.1, 0.3))
            predicted_video_views = int(predicted_impressions * np.random.uniform(0.5, 0.9))
            
            return PredictionResponse(
                predicted_likes=predicted_likes,
                predicted_comments=predicted_comments,
                predicted_engagement=predicted_engagement,
                predicted_impressions=predicted_impressions,
                predicted_reach=predicted_reach,
                predicted_saves=predicted_saves,
                predicted_video_views=predicted_video_views,
                confidence_lower=0.7,
                confidence_upper=0.9,
                model_version="1.0.0"
            )
        except Exception as e:
            raise Exception(f"Prediction failed: {e}")
    
    async def analyze_caption_with_bert(self, caption: str) -> CaptionAnalysisResponse:
        """Analyze caption using BERT"""
        try:
            # Tokenize and encode
            inputs = self.bert_tokenizer(caption, return_tensors='pt', truncation=True, padding=True)
            
            with torch.no_grad():
                outputs = self.bert_model(**inputs)
                embeddings = outputs.last_hidden_state.mean(dim=1)
            
            # Dummy analysis for now
            sentiment_score = float(np.random.uniform(-1, 1))
            key_topics = ["technology", "tutorial", "review"]  # Dummy topics
            engagement_prediction = float(np.random.uniform(0.1, 0.9))
            suggestions = [
                "Add more engaging hashtags",
                "Include a call-to-action",
                "Optimize posting time"
            ]
            
            return CaptionAnalysisResponse(
                sentiment_score=sentiment_score,
                key_topics=key_topics,
                engagement_prediction=engagement_prediction,
                suggestions=suggestions
            )
        except Exception as e:
            raise Exception(f"Caption analysis failed: {e}")
    
    def _extract_features(self, video_data: VideoData) -> np.ndarray:
        """Extract features from video data"""
        features = [
            len(video_data.title),
            len(video_data.description),
            len(video_data.tags),
            video_data.video_length,
            video_data.posting_time.hour,
            video_data.posting_time.weekday(),
            video_data.channel_stats.get('subscriber_count', 0),
            video_data.channel_stats.get('video_count', 0)
        ]
        return np.array(features).reshape(1, -1)

ml_service = MLService()