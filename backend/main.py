"""
PrePost Analytics API - Main Application

FastAPI backend server for YouTube video performance prediction and analytics.

Key Features:
- ML-based video performance predictions (XGBoost + BERT + CNN)
- Title optimization with variation testing
- Thumbnail A/B testing
- YouTube API integration for channel data
- Rate limiting and CORS protection
- Model loading at startup for 5-10x faster predictions

Architecture:
- Models loaded once at startup (singleton pattern)
- Predictions: 0.5-1 second (vs 5-8 seconds with per-request loading)
- Training data: 51,888 YouTube videos
- Model accuracy: 95.6% R²

Endpoints:
- /predict: Video performance predictions
- /optimizer: Title optimization
- /thumbnail: Thumbnail comparison
- /youtube: YouTube API proxy
- /analytics: Performance analytics
- /auth: User authentication
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api.routes import auth, predictions, optimizer, dashboard, thumbnail, youtube, analytics, model_info
from app.core.config import settings
from app.services.prediction_service import PredictionService
import traceback

print("\n" + "="*60)
print("LOADING CONFIGURATION")
print(f"DATABASE_URL: {settings.DATABASE_URL[:80]}...")
print("="*60 + "\n")

# Initialize rate limiter to prevent API abuse
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="PrePost Analytics API",
    description="YouTube Analytics and ML Prediction API",
    version="1.0.0"
)

print("\n" + "="*50)
print("FASTAPI APP INITIALIZED")
print("Exception handler registered")
print("="*50 + "\n")

@app.on_event("startup")
async def startup_event():
    """
    Load ML models when server starts (Performance Optimization)
    
    This loads models once at startup instead of on every request:
    - XGBoost model (51,888 videos)
    - BERT model (text embeddings)
    - CNN model (thumbnail features)
    - Encoders and scalers
    
    Performance: 5-10x faster predictions (0.5-1s vs 5-8s)
    Trade-off: 15-20 second startup, ~2GB RAM usage
    """
    print("\n" + "="*60)
    print("SERVER STARTUP - LOADING ML MODELS")
    print("="*60)
    try:
        prediction_service = PredictionService()
        prediction_service.load_models()
        print("✓ Server ready to accept prediction requests")
    except Exception as e:
        print(f"✗ ERROR loading models: {e}")
        print("Server will start but predictions will fail")
        traceback.print_exc()
    print("="*60 + "\n")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler with detailed logging"""
    import sys
    print(f"\n{'='*50}", file=sys.stderr, flush=True)
    print(f"ERROR CAUGHT", file=sys.stderr, flush=True)
    print(f"Path: {request.url.path}", file=sys.stderr, flush=True)
    print(f"Error: {str(exc)}", file=sys.stderr, flush=True)
    print(f"Type: {type(exc).__name__}", file=sys.stderr, flush=True)
    print(f"Traceback:", file=sys.stderr, flush=True)
    traceback.print_exc(file=sys.stderr)
    print(f"{'='*50}\n", file=sys.stderr, flush=True)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__}
    )

# Configure rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add async logging middleware to track API requests (non-blocking)
from app.core.logging_middleware import LoggingMiddleware
app.add_middleware(LoggingMiddleware)

# CORS middleware - Allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://localhost",       # Frontend container (port 80)
        "http://localhost:80",    # Frontend container explicit
        "http://localhost:5000"   # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(predictions.router, prefix="/predict", tags=["predictions"])
app.include_router(optimizer.router, prefix="/optimizer", tags=["optimizer"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(thumbnail.router, prefix="/thumbnail", tags=["thumbnail"])
app.include_router(youtube.router, prefix="/youtube", tags=["youtube"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(model_info.router, prefix="/model", tags=["model"])

@app.get("/")
@limiter.limit("100/minute")
async def root(request: Request):
    """API root endpoint"""
    return {"message": "PrePost Analytics API", "version": "1.0.0"}

@app.get("/health")
@limiter.limit("100/minute")
async def health_check(request: Request):
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}