import httpx
from typing import Dict, List, Optional
from app.core.config import settings

class YouTubeService:
    def __init__(self):
        self.api_key = settings.YOUTUBE_API_KEY
        self.base_url = "https://www.googleapis.com/youtube/v3"
    
    async def get_channel_stats(self, channel_id: str) -> Dict:
        """Get channel statistics"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/channels",
                params={
                    "part": "statistics",
                    "id": channel_id,
                    "key": self.api_key
                },
                headers={"Referer": ""}
            )
            return response.json()
    
    async def get_video_details(self, video_id: str) -> Dict:
        """Get video details and statistics"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/videos",
                params={
                    "part": "statistics,snippet",
                    "id": video_id,
                    "key": self.api_key
                }
            )
            return response.json()
    
    async def get_trending_videos(self, category_id: str = "0", max_results: int = 50) -> Dict:
        """Get trending videos for training data"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/videos",
                params={
                    "part": "statistics,snippet",
                    "chart": "mostPopular",
                    "regionCode": "US",
                    "categoryId": category_id,
                    "maxResults": max_results,
                    "key": self.api_key
                }
            )
            return response.json()
    
    async def search_videos(self, query: str, max_results: int = 50) -> Dict:
        """Search videos by keyword"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/search",
                params={
                    "part": "snippet",
                    "q": query,
                    "type": "video",
                    "maxResults": max_results,
                    "key": self.api_key
                }
            )
            return response.json()

youtube_service = YouTubeService()