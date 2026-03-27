from fastapi import APIRouter, HTTPException, Request
from app.services.youtube_service import youtube_service
from app.services.prediction_service import PredictionService
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel
from typing import Optional
import numpy as np
from datetime import datetime
import re

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)
prediction_service = PredictionService()

class ChannelAnalyticsRequest(BaseModel):
    channel_id: str
    max_videos: Optional[int] = 100

@router.post("/channel-analytics")
@limiter.limit("10/minute")
async def get_channel_analytics(request: Request, body: ChannelAnalyticsRequest):
    """Get comprehensive analytics for a YouTube channel"""
    try:
        # Fetch channel videos
        videos_data = await youtube_service.get_channel_videos(
            body.channel_id,
            max_results=body.max_videos
        )
        
        if not videos_data.get('items'):
            raise HTTPException(status_code=404, detail="No videos found for this channel")
        
        videos = videos_data['items']
        channel_info = videos_data['channel_info']
        
        # Calculate analytics
        analytics = calculate_channel_analytics(videos, channel_info)
        
        return analytics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def parse_duration(duration_str):
    """Parse ISO 8601 duration to seconds"""
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds

def calculate_channel_analytics(videos, channel_info):
    """Calculate comprehensive analytics from video data"""
    
    # Extract video metrics
    video_stats = []
    for video in videos:
        try:
            stats = video['statistics']
            snippet = video['snippet']
            content_details = video['contentDetails']
            
            views = int(stats.get('viewCount', 0))
            likes = int(stats.get('likeCount', 0))
            comments = int(stats.get('commentCount', 0))
            duration_seconds = parse_duration(content_details['duration'])
            
            # Calculate engagement rate
            engagement = (likes + comments) / views * 100 if views > 0 else 0
            
            # Parse publish date
            published_at = datetime.fromisoformat(snippet['publishedAt'].replace('Z', '+00:00'))
            
            video_stats.append({
                'video_id': video['id'],
                'title': snippet['title'],
                'description': snippet['description'],
                'published_at': published_at,
                'views': views,
                'likes': likes,
                'comments': comments,
                'duration_seconds': duration_seconds,
                'engagement_rate': engagement,
                'thumbnail': snippet['thumbnails']['high']['url'] if 'high' in snippet['thumbnails'] else snippet['thumbnails']['default']['url'],
                'category_id': int(snippet.get('categoryId', 0)),
                'day_of_week': published_at.strftime('%A'),
                'hour': published_at.hour
            })
        except Exception as e:
            print(f"Error processing video: {e}")
            continue
    
    if not video_stats:
        raise ValueError("No valid video data to analyze")
    
    # Calculate aggregate metrics
    total_views = sum(v['views'] for v in video_stats)
    total_likes = sum(v['likes'] for v in video_stats)
    total_comments = sum(v['comments'] for v in video_stats)
    avg_views = np.mean([v['views'] for v in video_stats])
    median_views = np.median([v['views'] for v in video_stats])
    avg_engagement = np.mean([v['engagement_rate'] for v in video_stats])
    
    # Find best performing videos
    top_videos = sorted(video_stats, key=lambda x: x['views'], reverse=True)[:5]
    
    # Analyze posting patterns
    day_performance = {}
    for video in video_stats:
        day = video['day_of_week']
        if day not in day_performance:
            day_performance[day] = {'views': [], 'engagement': []}
        day_performance[day]['views'].append(video['views'])
        day_performance[day]['engagement'].append(video['engagement_rate'])
    
    # Calculate average performance by day
    day_averages = {}
    for day, data in day_performance.items():
        day_averages[day] = {
            'avg_views': np.mean(data['views']),
            'avg_engagement': np.mean(data['engagement']),
            'video_count': len(data['views'])
        }
    
    # Find best day
    best_day = max(day_averages.items(), key=lambda x: x[1]['avg_views'])
    
    # Analyze posting times
    hour_performance = {}
    for video in video_stats:
        hour = video['hour']
        if hour not in hour_performance:
            hour_performance[hour] = {'views': [], 'engagement': []}
        hour_performance[hour]['views'].append(video['views'])
        hour_performance[hour]['engagement'].append(video['engagement_rate'])
    
    # Find best time range
    hour_averages = {
        hour: {
            'avg_views': np.mean(data['views']),
            'avg_engagement': np.mean(data['engagement']),
            'video_count': len(data['views'])
        }
        for hour, data in hour_performance.items()
    }
    
    best_hour = max(hour_averages.items(), key=lambda x: x[1]['avg_views'])
    
    # Analyze duration performance
    duration_ranges = {
        'short': [],  # < 5 min
        'medium': [],  # 5-15 min
        'long': []  # > 15 min
    }
    
    for video in video_stats:
        duration_min = video['duration_seconds'] / 60
        if duration_min < 5:
            duration_ranges['short'].append(video['views'])
        elif duration_min < 15:
            duration_ranges['medium'].append(video['views'])
        else:
            duration_ranges['long'].append(video['views'])
    
    duration_analysis = {
        key: {
            'avg_views': np.mean(views) if views else 0,
            'video_count': len(views)
        }
        for key, views in duration_ranges.items()
    }
    
    # Calculate growth trend (compare first half vs second half)
    mid_point = len(video_stats) // 2
    recent_videos = video_stats[:mid_point]
    older_videos = video_stats[mid_point:]
    
    recent_avg = np.mean([v['views'] for v in recent_videos]) if recent_videos else 0
    older_avg = np.mean([v['views'] for v in older_videos]) if older_videos else 0
    growth_rate = ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0
    
    # Engagement insights
    high_engagement_videos = [v for v in video_stats if v['engagement_rate'] > avg_engagement * 1.5]
    low_engagement_videos = [v for v in video_stats if v['engagement_rate'] < avg_engagement * 0.5]
    
    # Title analysis - find common words in top performers
    from collections import Counter
    top_video_words = []
    for video in top_videos:
        words = video['title'].lower().split()
        top_video_words.extend([w for w in words if len(w) > 4])
    
    common_words = Counter(top_video_words).most_common(10)
    
    return {
        'channel_info': channel_info,
        'overview': {
            'total_videos': len(video_stats),
            'total_views': total_views,
            'total_likes': total_likes,
            'total_comments': total_comments,
            'avg_views': int(avg_views),
            'median_views': int(median_views),
            'avg_engagement_rate': round(avg_engagement, 2),
            'growth_rate': round(growth_rate, 1)
        },
        'top_videos': [
            {
                'video_id': v['video_id'],
                'title': v['title'],
                'views': v['views'],
                'likes': v['likes'],
                'engagement_rate': round(v['engagement_rate'], 2),
                'thumbnail': v['thumbnail'],
                'published_at': v['published_at'].isoformat()
            }
            for v in top_videos
        ],
        'posting_patterns': {
            'best_day': {
                'day': best_day[0],
                'avg_views': int(best_day[1]['avg_views']),
                'avg_engagement': round(best_day[1]['avg_engagement'], 2),
                'video_count': best_day[1]['video_count']
            },
            'best_hour': {
                'hour': best_hour[0],
                'avg_views': int(best_hour[1]['avg_views']),
                'avg_engagement': round(best_hour[1]['avg_engagement'], 2),
                'video_count': best_hour[1]['video_count']
            },
            'day_breakdown': {
                day: {
                    'avg_views': int(data['avg_views']),
                    'avg_engagement': round(data['avg_engagement'], 2),
                    'video_count': data['video_count']
                }
                for day, data in day_averages.items()
            },
            'hour_breakdown': {
                str(hour): {
                    'avg_views': int(data['avg_views']),
                    'avg_engagement': round(data['avg_engagement'], 2),
                    'video_count': data['video_count']
                }
                for hour, data in hour_averages.items()
            }
        },
        'duration_analysis': {
            'short_videos': {
                'label': '< 5 minutes',
                'avg_views': int(duration_analysis['short']['avg_views']),
                'video_count': duration_analysis['short']['video_count']
            },
            'medium_videos': {
                'label': '5-15 minutes',
                'avg_views': int(duration_analysis['medium']['avg_views']),
                'video_count': duration_analysis['medium']['video_count']
            },
            'long_videos': {
                'label': '> 15 minutes',
                'avg_views': int(duration_analysis['long']['avg_views']),
                'video_count': duration_analysis['long']['video_count']
            }
        },
        'engagement_insights': {
            'high_performers': len(high_engagement_videos),
            'low_performers': len(low_engagement_videos),
            'consistency_score': round((1 - np.std([v['engagement_rate'] for v in video_stats]) / avg_engagement) * 100, 1) if avg_engagement > 0 else 0
        },
        'content_insights': {
            'common_words_in_top_videos': [{'word': word, 'count': count} for word, count in common_words]
        },
        'all_videos': [
            {
                'video_id': v['video_id'],
                'title': v['title'],
                'views': v['views'],
                'likes': v['likes'],
                'comments': v['comments'],
                'engagement_rate': round(v['engagement_rate'], 2),
                'duration_seconds': v['duration_seconds'],
                'published_at': v['published_at'].isoformat(),
                'thumbnail': v['thumbnail'],
                'day_of_week': v['day_of_week'],
                'hour': v['hour']
            }
            for v in video_stats
        ]
    }
