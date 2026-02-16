"""
API Request Logging Middleware
Logs all API requests to audit.api_request_logs table (async/non-blocking)
"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.db.database import SessionLocal
from app.models.database_models import APIRequestLog
import time
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Thread pool for async database operations
executor = ThreadPoolExecutor(max_workers=5)

def log_to_database(user_id, endpoint, status_code):
    """Log API request to database (runs in thread pool)"""
    try:
        db = SessionLocal()
        log_entry = APIRequestLog(
            user_id=user_id,
            endpoint=endpoint,
            status_code=status_code
        )
        db.add(log_entry)
        db.commit()
        db.close()
        print(f"✓ Logged API request: {endpoint} ({status_code})")
    except Exception as e:
        print(f"Failed to log API request: {e}")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip logging for health checks and static files
        if request.url.path in ["/health", "/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)
        
        start_time = time.time()
        
        # Get user_id from request state if authenticated
        user_id = getattr(request.state, "user_id", None)
        
        # Process request
        response = await call_next(request)
        
        # Log to database asynchronously (non-blocking)
        loop = asyncio.get_event_loop()
        loop.run_in_executor(
            executor,
            log_to_database,
            user_id,
            request.url.path,
            response.status_code
        )
        
        return response
