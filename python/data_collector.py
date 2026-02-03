# python/data_collector.py
import requests
import pandas as pd
import json
from datetime import datetime, timedelta
import time

class YouTubeDataCollector:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://www.googleapis.com/youtube/v3'
        
    def get_trending_videos(self, max_results=50, region='US'):
        """Collect trending videos data"""
        url = f"{self.base_url}/videos"
        params = {
            'part': 'statistics,snippet,contentDetails',
            'chart': 'mostPopular',
            'regionCode': region,
            'maxResults': max_results,
            'key': self.api_key
        }
        
        response = requests.get(url, params=params)
        return response.json()
    
    def get_video_details(self, video_ids):
        """Get detailed info for specific videos"""
        url = f"{self.base_url}/videos"
        params = {
            'part': 'statistics,snippet,contentDetails',
            'id': ','.join(video_ids),
            'key': self.api_key
        }
        
        response = requests.get(url, params=params)
        return response.json()
    
    def search_videos(self, query, max_results=50):
        """Search for videos by keyword"""
        url = f"{self.base_url}/search"
        params = {
            'part': 'snippet',
            'q': query,
            'type': 'video',
            'maxResults': max_results,
            'key': self.api_key
        }
        
        response = requests.get(url, params=params)
        return response.json()
    
    def collect_training_data(self, categories=['tech', 'gaming', 'music', 'education']):
        """Collect comprehensive training data"""
        all_data = []
        
        # Get trending videos
        print("Collecting trending videos...")
        trending = self.get_trending_videos()
        
        for video in trending.get('items', []):
            data_point = self.extract_features(video)
            all_data.append(data_point)
        
        # Search by categories
        for category in categories:
            print(f"Collecting {category} videos...")
            search_results = self.search_videos(category)
            
            # Get video IDs
            video_ids = [item['id']['videoId'] for item in search_results.get('items', [])]
            
            # Get detailed stats
            if video_ids:
                details = self.get_video_details(video_ids)
                for video in details.get('items', []):
                    data_point = self.extract_features(video)
                    data_point['category'] = category
                    all_data.append(data_point)
            
            time.sleep(1)  # Rate limiting
        
        return pd.DataFrame(all_data)
    
    def extract_features(self, video):
        """Extract ML features from video data"""
        snippet = video.get('snippet', {})
        stats = video.get('statistics', {})
        content = video.get('contentDetails', {})
        
        # Parse duration
        duration = content.get('duration', 'PT0S')
        duration_seconds = self.parse_duration(duration)
        
        return {
            'video_id': video.get('id'),
            'title': snippet.get('title', ''),
            'description': snippet.get('description', ''),
            'channel_title': snippet.get('channelTitle', ''),
            'published_at': snippet.get('publishedAt', ''),
            'duration_seconds': duration_seconds,
            'view_count': int(stats.get('viewCount', 0)),
            'like_count': int(stats.get('likeCount', 0)),
            'comment_count': int(stats.get('commentCount', 0)),
            'title_length': len(snippet.get('title', '')),
            'description_length': len(snippet.get('description', '')),
            'tags_count': len(snippet.get('tags', [])),
            'category_id': snippet.get('categoryId', ''),
            'default_language': snippet.get('defaultLanguage', ''),
            'engagement_rate': self.calculate_engagement_rate(stats)
        }
    
    def parse_duration(self, duration):
        """Convert YouTube duration to seconds"""
        import re
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, duration)
        if match:
            hours = int(match.group(1) or 0)
            minutes = int(match.group(2) or 0)
            seconds = int(match.group(3) or 0)
            return hours * 3600 + minutes * 60 + seconds
        return 0
    
    def calculate_engagement_rate(self, stats):
        """Calculate engagement rate"""
        views = int(stats.get('viewCount', 0))
        likes = int(stats.get('likeCount', 0))
        comments = int(stats.get('commentCount', 0))
        
        if views > 0:
            return ((likes + comments) / views) * 100
        return 0

# Usage script
if __name__ == "__main__":
    API_KEY = "YOUR_API_KEY_HERE"  # Replace with your actual API key
    
    collector = YouTubeDataCollector(API_KEY)
    
    print("Starting data collection...")
    df = collector.collect_training_data()
    
    # Save to CSV
    df.to_csv('youtube_training_data.csv', index=False)
    print(f"Collected {len(df)} videos")
    print("Data saved to youtube_training_data.csv")
    
    # Display sample
    print("\nSample data:")
    print(df.head())