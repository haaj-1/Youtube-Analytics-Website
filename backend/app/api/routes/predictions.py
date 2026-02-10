from fastapi import APIRouter, HTTPException
from app.services.prediction_service import PredictionService
from pydantic import BaseModel

router = APIRouter()
prediction_service = PredictionService()

class PredictRequest(BaseModel):
    title: str
    description: str
    thumbnail_url: str
    category_id: int
    subscriber_count: int
    duration_seconds: int

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