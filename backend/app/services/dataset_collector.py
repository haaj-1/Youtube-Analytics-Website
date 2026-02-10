import asyncio
import httpx
from typing import List, Dict
from datetime import datetime
from app.core.config import settings
from sqlalchemy.orm import Session
from app.db.database import SessionLocal

class DatasetCollector:
    """Collect YouTube data for ML training"""
    
    CATEGORIES = {
        "1": "Film & Animation",
        "2": "Autos & Vehicles",
        "15": "Pets & Animals",
        "17": "Sports",
        "19": "Travel & Events",
        "20": "Gaming",
        "22": "People & Blogs",
        "23": "Comedy",
        "24": "Entertainment",
        "25": "News & Politics",
        "26": "Howto & Style",
        "27": "Education",
        "28": "Science & Technology",
        "29": "Nonprofits & Activism",
        "44": "Trailers"
    }
    
    SUBSCRIBER_RANGES = [
        (0, 1000),
        (1000, 10000),
        (10000, 50000),
        (50000, 100000),
        (100000, 250000),
        (250000, 500000),
        (500000, 1000000),
        (1000000, 10000000),
        (10000000, None)
    ]
    
    def __init__(self):
        self.api_key = settings.YOUTUBE_API_KEY
        self.base_url = "https://www.googleapis.com/youtube/v3"
    
    async def collect_trending_videos(self, category_id: str, max_results: int = 50) -> List[Dict]:
        """Collect popular videos for a category using multiple search queries for diversity"""
        category_queries = {
            "1": ["animation", "animated movie", "cartoon", "anime", "short film", "film review", "movie analysis", "behind the scenes", "animated series", "film making", "animation tutorial", "movie trailer"],
            "2": ["cars", "automotive", "vehicles", "car review", "motorcycle", "auto repair", "racing", "electric vehicle", "truck review", "car modification", "vehicle test drive", "auto news"],
            "15": ["pets", "animals", "cute animals", "pet care", "funny pets", "animal rescue", "wildlife", "dog training", "cat videos", "exotic pets", "pet vlog", "animal documentary"],
            "17": ["sports", "game highlights", "sports news", "training tips", "match recap", "athlete interview", "workout", "sports analysis", "fitness", "sports documentary", "game analysis", "sports tutorial"],
            "19": ["travel", "vacation", "tourism", "travel vlog", "destination guide", "adventure travel", "city tour", "backpacking", "hotel review", "travel tips", "travel documentary", "world tour"],
            "20": ["gaming", "gameplay", "game review", "let's play", "game walkthrough", "gaming news", "esports", "game tips", "gaming tutorial", "game stream", "gaming highlights", "game commentary"],
            "22": ["vlog", "daily vlog", "lifestyle", "day in my life", "life update", "morning routine", "family vlog", "personal story", "life advice", "weekly vlog", "lifestyle tips", "personal vlog"],
            "23": ["comedy", "funny", "humor", "comedy sketch", "stand up comedy", "pranks", "funny moments", "parody", "comedy show", "funny video", "jokes", "comedy skit"],
            "24": ["entertainment", "celebrity", "show", "celebrity interview", "talk show", "variety show", "red carpet", "awards show", "entertainment news", "celebrity gossip", "tv show", "entertainment tonight"],
            "25": ["news", "politics", "current events", "breaking news", "political analysis", "news update", "world news", "political debate", "news today", "political commentary", "news analysis", "politics today"],
            "26": ["tutorial", "how to", "diy", "makeup tutorial", "fashion haul", "beauty tips", "home decor", "cooking recipe", "life hacks", "style guide", "beauty routine", "diy project"],
            "27": ["education", "learning", "lesson", "educational video", "explained", "course", "study tips", "lecture", "how to learn", "tutorial", "educational content", "learning tips"],
            "28": ["technology", "science", "tech review", "gadget review", "programming tutorial", "tech tips", "innovation", "science experiment", "tech news", "coding tutorial", "science explained", "tech unboxing"],
            "29": ["charity", "nonprofit", "activism", "social cause", "fundraising", "volunteer", "awareness campaign", "social impact", "community service", "social justice", "humanitarian", "nonprofit organization"],
            "44": ["trailer", "movie trailer", "teaser", "official trailer", "film trailer", "upcoming movie", "new release", "preview", "movie preview", "film teaser", "trailer reaction", "movie announcement"]
        }
        
        queries = category_queries.get(category_id, ["popular"])
        import random
        query = random.choice(queries)
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            all_video_ids = []
            next_page_token = None
            
            for page in range(2):
                params = {
                    "part": "id",
                    "type": "video",
                    "q": query,
                    "order": "relevance",
                    "maxResults": 50,
                    "key": self.api_key
                }
                
                if next_page_token:
                    params["pageToken"] = next_page_token
                
                response = await client.get(f"{self.base_url}/search", params=params)
                search_data = response.json()
                
                print(f"Search API response status: {response.status_code}")
                if "error" in search_data:
                    print(f"API Error: {search_data['error']}")
                    return []
                
                if "items" not in search_data:
                    print(f"No items in response. Response keys: {search_data.keys()}")
                    break
                
                all_video_ids.extend([item["id"]["videoId"] for item in search_data["items"]])
                next_page_token = search_data.get("nextPageToken")
                
                if not next_page_token:
                    break
            
            if not all_video_ids:
                return []
            
            all_videos = []
            for i in range(0, len(all_video_ids), 50):
                batch_ids = all_video_ids[i:i+50]
                videos_response = await client.get(
                    f"{self.base_url}/videos",
                    params={
                        "part": "snippet,statistics,contentDetails",
                        "id": ",".join(batch_ids),
                        "key": self.api_key
                    }
                )
                data = videos_response.json()
                
                if "items" in data:
                    all_videos.extend(data["items"])
            
            if not all_videos:
                return []
            
            channel_ids = list(set([item["snippet"]["channelId"] for item in all_videos]))
            
            channel_stats = {}
            for i in range(0, len(channel_ids), 50):
                batch_channel_ids = channel_ids[i:i+50]
                channels_response = await client.get(
                    f"{self.base_url}/channels",
                    params={
                        "part": "statistics",
                        "id": ",".join(batch_channel_ids),
                        "key": self.api_key
                    }
                )
                channels_data = channels_response.json()
                for channel in channels_data.get("items", []):
                    sub_count = channel["statistics"].get("subscriberCount")
                    if sub_count:
                        try:
                            channel_stats[channel["id"]] = int(sub_count)
                        except:
                            channel_stats[channel["id"]] = 0
            
            videos = []
            for item in all_videos:
                channel_id = item["snippet"]["channelId"]
                subscriber_count = channel_stats.get(channel_id, 0)
                video_data = await self._extract_video_features(item, subscriber_count)
                if video_data:
                    videos.append(video_data)
            
            return videos
    
    async def collect_channel_videos(self, channel_id: str, max_results: int = 50) -> List[Dict]:
        """Collect videos from a specific channel"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            channel_response = await client.get(
                f"{self.base_url}/channels",
                params={
                    "part": "statistics",
                    "id": channel_id,
                    "key": self.api_key
                }
            )
            channel_data = channel_response.json()
            
            if "items" not in channel_data or not channel_data["items"]:
                return []
            
            subscriber_count = int(channel_data["items"][0]["statistics"].get("subscriberCount", 0))
            
            search_response = await client.get(
                f"{self.base_url}/search",
                params={
                    "part": "id",
                    "channelId": channel_id,
                    "type": "video",
                    "order": "date",
                    "maxResults": max_results,
                    "key": self.api_key
                }
            )
            search_data = search_response.json()
            
            if "items" not in search_data:
                return []
            
            video_ids = [item["id"]["videoId"] for item in search_data["items"]]
            
            videos_response = await client.get(
                f"{self.base_url}/videos",
                params={
                    "part": "snippet,statistics,contentDetails",
                    "id": ",".join(video_ids),
                    "key": self.api_key
                }
            )
            videos_data = videos_response.json()
            
            videos = []
            for item in videos_data.get("items", []):
                video_data = await self._extract_video_features(item, subscriber_count)
                if video_data:
                    videos.append(video_data)
            
            return videos
    
    async def _extract_video_features(self, item: Dict, subscriber_count: int = None) -> Dict:
        """Extract relevant features from video data"""
        try:
            snippet = item["snippet"]
            statistics = item["statistics"]
            content_details = item["contentDetails"]
            
            duration = self._parse_duration(content_details.get("duration", "PT0S"))
            
            views = int(statistics.get("viewCount", 0))
            likes = int(statistics.get("likeCount", 0))
            comments = int(statistics.get("commentCount", 0))
            
            engagement_rate = (likes + comments) / views if views > 0 else 0
            
            thumbnails = snippet.get("thumbnails", {})
            thumbnail_url = thumbnails.get("maxres", thumbnails.get("high", {})).get("url", "")
            
            return {
                "video_id": item["id"],
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "channel_id": snippet.get("channelId", ""),
                "channel_title": snippet.get("channelTitle", ""),
                "category_id": snippet.get("categoryId", ""),
                "published_at": snippet.get("publishedAt", ""),
                "thumbnail_url": thumbnail_url,
                "duration_seconds": duration,
                "view_count": views,
                "like_count": likes,
                "comment_count": comments,
                "engagement_rate": engagement_rate,
                "subscriber_count": subscriber_count if subscriber_count else None,
                "subscriber_range": self.get_subscriber_range(subscriber_count) if subscriber_count else None,
                "tags": snippet.get("tags", []),
                "collected_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            print(f"Error extracting features: {e}")
            return None
    
    def _parse_duration(self, duration_str: str) -> int:
        """Parse ISO 8601 duration to seconds"""
        import re
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, duration_str)
        if not match:
            return 0
        
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        
        return hours * 3600 + minutes * 60 + seconds
    
    def get_subscriber_range(self, subscriber_count: int) -> str:
        """Categorize channel by subscriber count"""
        if not subscriber_count:
            return None
        for min_subs, max_subs in self.SUBSCRIBER_RANGES:
            if max_subs is None:
                if subscriber_count >= min_subs:
                    return f"{min_subs}+"
            elif min_subs <= subscriber_count < max_subs:
                return f"{min_subs}-{max_subs}"
        return "0-1000"

dataset_collector = DatasetCollector()
