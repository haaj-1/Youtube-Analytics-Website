"""
PrePost Analytics - ML-only FastAPI app for Hugging Face Spaces.
Standalone - no database, no auth, no config dependencies.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import traceback
import os

app = FastAPI(
    title="PrePost Analytics ML API",
    description="ML prediction endpoints for PrePostTube",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load models once at startup ───────────────────────────────────────────────
prediction_service = None

@app.on_event("startup")
async def startup_event():
    global prediction_service
    print("Loading ML models...")
    try:
        from app.services.prediction_service import PredictionService
        prediction_service = PredictionService()
        prediction_service.model_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "app", "ml", "models"
        )
        prediction_service.load_models()
        print("✓ ML models loaded")
    except Exception as e:
        print(f"✗ Model load failed: {e}")
        traceback.print_exc()

# ── Request/Response models ───────────────────────────────────────────────────
class PredictRequest(BaseModel):
    title: str
    description: str
    thumbnail_url: str
    category_id: int
    subscriber_count: int
    duration_seconds: int

class OptimizeRequest(BaseModel):
    base_title: str
    description: str
    category_id: int
    subscriber_count: int
    duration_seconds: int
    thumbnail_url: Optional[str] = None

class PersonalizedModelRequest(BaseModel):
    channel_id: str
    max_videos: Optional[int] = 40

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"message": "PrePost ML API", "status": "running"}

@app.get("/health")
async def health():
    loaded = prediction_service is not None and prediction_service.models_loaded
    return {"status": "healthy", "models_loaded": loaded}

@app.post("/predict/")
async def predict(request: PredictRequest):
    if not prediction_service or not prediction_service.models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded yet")
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

@app.post("/predict/personalized")
async def create_personalized_model(request: PersonalizedModelRequest):
    if not prediction_service or not prediction_service.models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded yet")
    try:
        import httpx
        youtube_api_key = os.getenv("YOUTUBE_API_KEY", "")
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://www.googleapis.com/youtube/v3/search",
                params={"part": "snippet", "channelId": request.channel_id,
                        "maxResults": request.max_videos, "order": "date",
                        "type": "video", "key": youtube_api_key}
            )
            data = resp.json()
        if not data.get("items"):
            raise HTTPException(status_code=404, detail="No videos found")
        result = prediction_service.train_personalized_model(
            data["items"], data.get("channel_info", {})
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/personalized/predict")
async def predict_personalized(request: PredictRequest):
    if not prediction_service or not prediction_service.models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded yet")
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

@app.post("/optimizer/optimize-title")
async def optimize_title(request: OptimizeRequest):
    if not prediction_service or not prediction_service.models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded yet")
    try:
        import re
        from datetime import datetime

        def generate_variations(base_title, category_id):
            variations = [base_title]
            current_year = datetime.now().year
            has_numbers = bool(re.search(r'\d', base_title))
            is_how_to = base_title.lower().startswith('how to')
            if str(current_year) not in base_title:
                variations.append(f"{base_title} ({current_year})")
            if not has_numbers:
                if is_how_to:
                    variations.extend([f"{base_title} in 5 Minutes", f"{base_title} - Step by Step"])
                else:
                    variations.extend([f"Top 10 {base_title}", f"5 Amazing {base_title}"])
            variations.extend([
                f"{base_title} for Beginners",
                f"Ultimate {base_title} Guide {current_year}",
                f"Everything You Need to Know About {base_title}",
                f"I Tried {base_title} and This Happened",
            ])
            return list(dict.fromkeys(variations))[:10]

        variations = generate_variations(request.base_title, request.category_id)
        results = []
        original_views = None

        for idx, title in enumerate(variations):
            pred = prediction_service.predict_performance(
                title=title,
                description=request.description,
                thumbnail_url=request.thumbnail_url or "https://via.placeholder.com/1280x720",
                category_id=request.category_id,
                subscriber_count=request.subscriber_count,
                duration_seconds=request.duration_seconds
            )
            if idx == 0:
                original_views = pred["predicted_views"]
            improvement = ((pred["predicted_views"] - original_views) / original_views * 100) if original_views else 0
            # Strip thumbnail factors for optimizer
            fi = [f for f in (pred.get("feature_importance") or []) if f.get("type") != "thumbnail"]
            results.append({
                "title": title,
                "predicted_views": pred["predicted_views"],
                "improvement_percent": round(improvement, 1),
                "confidence": pred["confidence_score"],
                "insights": [],
                "confidence_interval": pred.get("confidence_interval"),
                "feature_importance": fi,
                "similar_videos": pred.get("similar_videos"),
            })

        results.sort(key=lambda x: x["predicted_views"], reverse=True)
        best = results[0]
        return {
            "original_views": original_views,
            "best_title": best["title"],
            "best_views": best["predicted_views"],
            "improvement": round((best["predicted_views"] - original_views) / original_views * 100, 1),
            "variations": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
