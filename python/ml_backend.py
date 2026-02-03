# python/ml_backend.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from transformers import BertTokenizer, BertModel
import torch
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pickle
import re
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)

# Load BERT model
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertModel.from_pretrained('bert-base-uncased')

class VideoPerformancePredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def extract_bert_features(self, text):
        """Extract BERT embeddings from text"""
        inputs = tokenizer(text, return_tensors='pt', max_length=512, truncation=True, padding=True)
        with torch.no_grad():
            outputs = bert_model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
    
    def extract_features(self, video_data):
        """Extract features from video data"""
        features = []
        
        # BERT features from title
        title_features = self.extract_bert_features(video_data['title'])
        features.extend(title_features)
        
        # Basic features
        features.extend([
            len(video_data['title']),
            video_data['video_length'],
            len(video_data.get('tags', [])),
            self.get_posting_hour(video_data['posting_time']),
            self.get_posting_day(video_data['posting_time'])
        ])
        
        return np.array(features).reshape(1, -1)
    
    def get_posting_hour(self, posting_time):
        return datetime.fromisoformat(posting_time.replace('Z', '+00:00')).hour
    
    def get_posting_day(self, posting_time):
        return datetime.fromisoformat(posting_time.replace('Z', '+00:00')).weekday()
    
    def predict(self, video_data):
        if not self.is_trained:
            return {"error": "Model not trained"}
        
        features = self.extract_features(video_data)
        features_scaled = self.scaler.transform(features)
        
        predictions = self.model.predict(features_scaled)
        
        return {
            "views": int(predictions[0] * 1000),
            "likes": int(predictions[0] * 50),
            "comments": int(predictions[0] * 5),
            "engagement_rate": round(predictions[0] * 0.05, 2)
        }

predictor = VideoPerformancePredictor()

@app.route('/predict', methods=['POST'])
def predict_performance():
    data = request.json
    prediction = predictor.predict(data)
    return jsonify(prediction)

@app.route('/analyze-caption', methods=['POST'])
def analyze_caption():
    caption = request.json['caption']
    
    # BERT sentiment analysis
    features = predictor.extract_bert_features(caption)
    
    # Extract hashtags
    hashtags = re.findall(r'#\w+', caption)
    
    # Basic metrics
    word_count = len(caption.split())
    char_count = len(caption)
    
    return jsonify({
        "sentiment_score": float(np.mean(features)),
        "hashtags": hashtags,
        "word_count": word_count,
        "char_count": char_count,
        "readability_score": min(100, max(0, 100 - word_count * 2)),
        "recommendations": [
            "Add more engaging questions" if "?" not in caption else "Good use of questions",
            "Include call-to-action" if "subscribe" not in caption.lower() else "Good CTA present"
        ]
    })

@app.route('/analyze-trends', methods=['POST'])
def analyze_trends():
    videos = request.json['videos']
    
    # Analyze trending patterns
    titles = [video['snippet']['title'] for video in videos]
    views = [int(video['statistics'].get('viewCount', 0)) for video in videos]
    
    # Common keywords in trending videos
    all_words = ' '.join(titles).lower().split()
    word_freq = {}
    for word in all_words:
        word_freq[word] = word_freq.get(word, 0) + 1
    
    trending_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
    
    return jsonify({
        "trending_keywords": [{"word": word, "frequency": freq} for word, freq in trending_keywords],
        "avg_views": np.mean(views),
        "optimal_title_length": np.mean([len(title) for title in titles]),
        "insights": [
            f"Average trending video gets {int(np.mean(views)):,} views",
            f"Optimal title length: {int(np.mean([len(title) for title in titles]))} characters"
        ]
    })

@app.route('/train', methods=['POST'])
def train_model():
    # This would typically load your training data
    # For demo, we'll simulate training
    predictor.is_trained = True
    return jsonify({"status": "Model trained successfully"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)