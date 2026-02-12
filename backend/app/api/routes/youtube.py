from fastapi import APIRouter, HTTPException, Request
from app.services.youtube_service import youtube_service
from app.core.config import settings
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/channel/{channel_id}")
@limiter.limit("30/minute")  # 1 unit per call, conservative limit
async def get_channel_stats(request: Request, channel_id: str):
    """Get YouTube channel statistics"""
    try:
        stats = await youtube_service.get_channel_stats(channel_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/video/{video_id}")
@limiter.limit("30/minute")  # 1 unit per call
async def get_video_details(request: Request, video_id: str):
    """Get YouTube video details"""
    try:
        details = await youtube_service.get_video_details(video_id)
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending")
@limiter.limit("10/minute")  # 100 units per call, stricter limit
async def get_trending_videos(request: Request, category_id: str = "0", max_results: int = 50):
    """Get trending YouTube videos"""
    try:
        videos = await youtube_service.get_trending_videos(category_id, max_results)
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/channel")
@limiter.limit("20/minute")
async def search_channel(request: Request, q: str):
    """Search for a YouTube channel by name"""
    try:
        results = await youtube_service.search_channel_by_name(q)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/channel/{channel_id}/videos")
@limiter.limit("20/minute")
async def get_channel_videos(request: Request, channel_id: str, max_results: int = 5, page_token: str = None):
    """Get recent videos from a channel with pagination support"""
    try:
        videos = await youtube_service.get_channel_videos(channel_id, max_results, page_token)
        return videos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))