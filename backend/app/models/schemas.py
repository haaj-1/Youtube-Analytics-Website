from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class VideoData(BaseModel):
    title: str
    description: str
    tags: List[str]
    thumbnail_features: Optional[dict] = None
    video_length: int
    posting_time: datetime
    channel_stats: dict

class PredictionResponse(BaseModel):
    predicted_likes: int
    predicted_comments: int
    predicted_engagement: int
    predicted_impressions: int
    predicted_reach: int
    predicted_saves: int
    predicted_video_views: int
    confidence_lower: float
    confidence_upper: float
    model_version: str

class CaptionAnalysis(BaseModel):
    caption: str

class CaptionAnalysisResponse(BaseModel):
    sentiment_score: float
    key_topics: List[str]
    engagement_prediction: float
    suggestions: List[str]

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    youtube_channel_id: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    youtube_channel_id: Optional[str]
    created_at: datetime