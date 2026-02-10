from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api.routes import auth, predictions, optimizer, dashboard
from app.core.config import settings
import traceback

# Initialize rate limiter
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

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
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

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware - Allows React frontend (localhost:3000/5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(predictions.router, prefix="/predict", tags=["predictions"])
app.include_router(optimizer.router, prefix="/optimizer", tags=["optimizer"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

@app.get("/")
@limiter.limit("100/minute")
async def root(request: Request):
    return {"message": "PrePost Analytics API", "version": "1.0.0"}

@app.get("/health")
@limiter.limit("100/minute")
async def health_check(request: Request):
    return {"status": "healthy"}