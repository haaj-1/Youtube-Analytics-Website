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
    
    async def search_channel_by_name(self, channel_name: str) -> Dict:
        """Search for a channel by name"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/search",
                params={
                    "part": "snippet",
                    "q": channel_name,
                    "type": "channel",
                    "maxResults": 5,
                    "key": self.api_key
                }
            )
            return response.json()
    
    async def get_channel_by_username(self, username: str) -> Dict:
        """Get channel by username/handle"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/channels",
                params={
                    "part": "snippet,statistics",
                    "forUsername": username,
                    "key": self.api_key
                }
            )
            return response.json()
    
    async def get_channel_videos(self, channel_id: str, max_results: int = 10, page_token: str = None) -> Dict:
        """Get recent videos from a channel with pagination support"""
        async with httpx.AsyncClient() as client:
            # First get the uploads playlist ID
            channel_response = await client.get(
                f"{self.base_url}/channels",
                params={
                    "part": "contentDetails,statistics,snippet",
                    "id": channel_id,
                    "key": self.api_key
                }
            )
            channel_data = channel_response.json()
            
            if not channel_data.get('items'):
                return {"items": [], "channel_info": None, "nextPageToken": None}
            
            channel_info = {
                "title": channel_data['items'][0]['snippet']['title'],
                "subscriber_count": int(channel_data['items'][0]['statistics'].get('subscriberCount', 0)),
                "thumbnail": channel_data['items'][0]['snippet']['thumbnails']['default']['url']
            }
            
            uploads_playlist_id = channel_data['items'][0]['contentDetails']['relatedPlaylists']['uploads']
            
            # For large requests (>50), fetch in batches
            all_items = []
            current_page_token = page_token
            remaining = max_results
            
            while remaining > 0:
                batch_size = min(50, remaining)  # YouTube API max is 50 per request
                
                playlist_params = {
                    "part": "snippet",
                    "playlistId": uploads_playlist_id,
                    "maxResults": batch_size,
                    "key": self.api_key
                }
                
                if current_page_token:
                    playlist_params["pageToken"] = current_page_token
                
                playlist_response = await client.get(
                    f"{self.base_url}/playlistItems",
                    params=playlist_params
                )
                playlist_data = playlist_response.json()
                
                items = playlist_data.get('items', [])
                if not items:
                    break
                
                all_items.extend(items)
                remaining -= len(items)
                
                current_page_token = playlist_data.get('nextPageToken')
                if not current_page_token:
                    break
            
            if not all_items:
                return {
                    "items": [], 
                    "channel_info": channel_info,
                    "nextPageToken": None
                }
            
            # Get video IDs
            video_ids = [item['snippet']['resourceId']['videoId'] for item in all_items]
            
            # Fetch video details in batches of 50
            all_videos = []
            for i in range(0, len(video_ids), 50):
                batch_ids = video_ids[i:i+50]
                
                videos_response = await client.get(
                    f"{self.base_url}/videos",
                    params={
                        "part": "snippet,statistics,contentDetails",
                        "id": ",".join(batch_ids),
                        "key": self.api_key
                    }
                )
                
                videos_data = videos_response.json()
                all_videos.extend(videos_data.get('items', []))
            
            return {
                'items': all_videos,
                'channel_info': channel_info,
                'nextPageToken': current_page_token
            }

youtube_service = YouTubeService()