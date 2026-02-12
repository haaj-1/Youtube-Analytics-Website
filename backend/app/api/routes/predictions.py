from fastapi import APIRouter, HTTPException
from app.services.prediction_service import PredictionService
from pydantic import BaseModel
from typing import Optional

router = APIRouter()
prediction_service = PredictionService()

class PredictRequest(BaseModel):
    title: str
    description: str
    thumbnail_url: str
    category_id: int
    subscriber_count: int
    duration_seconds: int

class PersonalizedModelRequest(BaseModel):
    channel_id: str
    max_videos: Optional[int] = 40

@router.post("/")
async def predict_performance(request: PredictRequest):
    """Predict video performance using trained ML models"""
    try:
        result = prediction_service.predict_performance(
            title=request.title,
            description=request.description,
            thumbnail_url=request.thumbnail_url,
            category_id=request.category_id,
            subscriber_count=request.subscriber_count,
            duration_seconds=request.duration_seconds
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/personalized")
async def create_personalized_model(request: PersonalizedModelRequest):
    """Create a personalized prediction model based on user's channel data"""
    try:
        from app.services.youtube_service import youtube_service
        
        # Fetch channel videos
        videos_data = await youtube_service.get_channel_videos(
            request.channel_id, 
            max_results=request.max_videos
        )
        
        if not videos_data.get('items'):
            raise HTTPException(status_code=404, detail="No videos found for this channel")
        
        # Train personalized model
        result = prediction_service.train_personalized_model(
            videos_data['items'],
            videos_data['channel_info']
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/personalized/predict")
async def predict_with_personalized_model(request: PredictRequest):
    """Predict using personalized model"""
    try:
        result = prediction_service.predict_with_personalized_model(
            title=request.title,
            description=request.description,
            thumbnail_url=request.thumbnail_url,
            category_id=request.category_id,
            subscriber_count=request.subscriber_count,
            duration_seconds=request.duration_seconds
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))