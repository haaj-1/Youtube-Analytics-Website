from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from app.services.prediction_service import PredictionService
from app.db.database import SessionLocal
from app.models.database_models import Prediction
from app.core.audit_logger import log_audit_event
from pydantic import BaseModel
from typing import Optional
import json

router = APIRouter()

# Get the singleton instance - models will be loaded at startup
prediction_service = PredictionService()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper to get user_id from token (optional - returns None if not authenticated)
def get_current_user_id(authorization: Optional[str] = None) -> Optional[int]:
    """Extract user_id from JWT token if present"""
    if not authorization:
        return None
    
    try:
        from app.core.security import decode_access_token
        token = authorization.replace("Bearer ", "")
        payload = decode_access_token(token)
        return payload.get("user_id")
    except:
        return None

# Background task to save prediction to database
def save_prediction_background(
    user_id: Optional[int],
    title: str,
    description: str,
    thumbnail_url: str,
    category_id: int,
    subscriber_count: int,
    result: dict
):
    """Save prediction to database in background"""
    try:
        db = SessionLocal()
        subscriber_range = prediction_service.get_subscriber_range(subscriber_count)
        
        prediction_record = Prediction(
            user_id=user_id or 0,
            video_id=None,
            thumbnail_url=thumbnail_url,
            title=title,
            description=description[:1000] if description else None,
            category_id=str(category_id),
            subscriber_range=subscriber_range,
            predicted_views=int(result.get('predicted_views', 0)),
            predicted_engagement_rate=result.get('predicted_engagement_rate'),
            predicted_ctr=result.get('predicted_ctr'),
            confidence_score=result.get('confidence_score'),
            recommendations=json.dumps(result.get('recommendations', []))
        )
        
        db.add(prediction_record)
        db.commit()
        db.close()
        
        # Log audit event if user is logged in
        if user_id:
            log_audit_event(user_id, "prediction", {
                "title": title,
                "predicted_views": int(result.get('predicted_views', 0))
            })
        
        print(f"✓ Saved prediction to database (background)")
    except Exception as e:
        print(f"Failed to save prediction in background: {e}")

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
async def predict_performance(request: PredictRequest, background_tasks: BackgroundTasks):
    """Predict video performance using trained ML models"""
    try:
        # Make prediction (fast - returns immediately)
        result = prediction_service.predict_performance(
            title=request.title,
            description=request.description,
            thumbnail_url=request.thumbnail_url,
            category_id=request.category_id,
            subscriber_count=request.subscriber_count,
            duration_seconds=request.duration_seconds
        )
        
        # Get user_id (None if not logged in)
        user_id = get_current_user_id(None)
        
        # Save prediction to database in background (non-blocking)
        background_tasks.add_task(
            save_prediction_background,
            user_id=user_id,
            title=request.title,
            description=request.description,
            thumbnail_url=request.thumbnail_url,
            category_id=request.category_id,
            subscriber_count=request.subscriber_count,
            result=result
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/personalized")
async def create_personalized_model(request: PersonalizedModelRequest, db: SessionLocal = Depends(get_db)):
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
        
        # Log audit event
        user_id = get_current_user_id(None)
        if user_id:
            log_audit_event(user_id, "personalized_model_training", {
                "channel_id": request.channel_id,
                "videos_analyzed": len(videos_data['items'])
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/personalized/predict")
async def predict_with_personalized_model(request: PredictRequest, background_tasks: BackgroundTasks):
    """Predict using personalized model"""
    try:
        # Make prediction (fast - returns immediately)
        result = prediction_service.predict_with_personalized_model(
            title=request.title,
            description=request.description,
            thumbnail_url=request.thumbnail_url,
            category_id=request.category_id,
            subscriber_count=request.subscriber_count,
            duration_seconds=request.duration_seconds
        )
        
        # Save prediction to database in background (non-blocking)
        user_id = get_current_user_id(None)
        background_tasks.add_task(
            save_prediction_background,
            user_id=user_id,
            title=request.title,
            description=request.description,
            thumbnail_url=request.thumbnail_url,
            category_id=request.category_id,
            subscriber_count=request.subscriber_count,
            result=result
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))