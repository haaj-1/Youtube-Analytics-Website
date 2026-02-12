from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import pyodbc
from datetime import datetime, timedelta
import os

router = APIRouter()

def get_db_connection():
    """Get database connection from environment variable"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise HTTPException(status_code=500, detail="Database configuration not found")
    
    # Parse the DATABASE_URL to extract server and database name
    # Format: mssql+pyodbc://SERVER/DATABASE?driver=...
    try:
        parts = database_url.split('/')
        server = parts[2]
        db_parts = parts[3].split('?')
        database = db_parts[0]
        
        conn_str = (
            "DRIVER={ODBC Driver 17 for SQL Server};"
            f"SERVER={server};"
            f"DATABASE={database};"
            "Trusted_Connection=yes;"
        )
        return pyodbc.connect(conn_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

@router.get("/category-performance")
async def get_category_performance():
    """
    Get performance metrics by category for bar/pie charts
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                video_category_id,
                COUNT(*) as video_count,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views,
                AVG(engagement_rate) as avg_engagement,
                SUM(video_view_count) as total_views
            FROM ml.videos_dataset
            WHERE video_category_id IS NOT NULL
            GROUP BY video_category_id
            ORDER BY total_views DESC
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        
        # Category mapping
        categories = {
            1: 'Film & Animation', 2: 'Autos & Vehicles', 10: 'Music',
            15: 'Pets & Animals', 17: 'Sports', 19: 'Travel & Events',
            20: 'Gaming', 22: 'People & Blogs', 23: 'Comedy',
            24: 'Entertainment', 25: 'News & Politics', 26: 'Howto & Style',
            27: 'Education', 28: 'Science & Technology', 29: 'Nonprofits & Activism'
        }
        
        result = []
        for row in rows:
            result.append({
                'category_id': row[0],
                'category_name': categories.get(row[0], 'Unknown'),
                'video_count': row[1],
                'avg_views': int(row[2]) if row[2] else 0,
                'avg_engagement': round(row[3], 2) if row[3] else 0,
                'total_views': int(row[4]) if row[4] else 0
            })
        
        conn.close()
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/subscriber-range-performance")
async def get_subscriber_range_performance():
    """
    Get performance by subscriber range for comparison charts
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                subscriber_range,
                COUNT(*) as video_count,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views,
                AVG(CAST(video_like_count AS FLOAT)) as avg_likes,
                AVG(engagement_rate) as avg_engagement,
                MIN(video_view_count) as min_views,
                MAX(video_view_count) as max_views
            FROM ml.videos_dataset
            WHERE subscriber_range IS NOT NULL
            GROUP BY subscriber_range
            ORDER BY 
                CASE subscriber_range
                    WHEN '0-1K' THEN 1
                    WHEN '1K-10K' THEN 2
                    WHEN '10K-50K' THEN 3
                    WHEN '50K-100K' THEN 4
                    WHEN '100K-250K' THEN 5
                    WHEN '250K-500K' THEN 6
                    WHEN '500K-1M' THEN 7
                    WHEN '1M-10M' THEN 8
                    WHEN '10M+' THEN 9
                END
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        
        result = []
        for row in rows:
            result.append({
                'subscriber_range': row[0],
                'video_count': row[1],
                'avg_views': int(row[2]) if row[2] else 0,
                'avg_likes': int(row[3]) if row[3] else 0,
                'avg_engagement': round(row[4], 2) if row[4] else 0,
                'min_views': int(row[5]) if row[5] else 0,
                'max_views': int(row[6]) if row[6] else 0
            })
        
        conn.close()
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending-over-time")
async def get_trending_over_time():
    """
    Get trending patterns over time for line charts
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                CAST(video_trending_date AS DATE) as trending_date,
                COUNT(*) as video_count,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views,
                SUM(video_view_count) as total_views
            FROM ml.videos_dataset
            WHERE video_trending_date IS NOT NULL
                AND video_trending_date >= DATEADD(month, -6, GETDATE())
            GROUP BY CAST(video_trending_date AS DATE)
            ORDER BY trending_date
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        
        result = []
        for row in rows:
            result.append({
                'date': row[0].strftime('%Y-%m-%d') if row[0] else None,
                'video_count': row[1],
                'avg_views': int(row[2]) if row[2] else 0,
                'total_views': int(row[3]) if row[3] else 0
            })
        
        conn.close()
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/top-videos")
async def get_top_videos(limit: int = 10):
    """
    Get top performing videos for leaderboard
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = f"""
            SELECT TOP {limit}
                video_id,
                video_title,
                channel_title,
                video_category_id,
                video_view_count,
                video_like_count,
                video_comment_count,
                engagement_rate,
                channel_subscriber_count,
                video_published_at
            FROM ml.videos_dataset
            WHERE video_view_count IS NOT NULL
            ORDER BY video_view_count DESC
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        
        categories = {
            1: 'Film & Animation', 2: 'Autos & Vehicles', 10: 'Music',
            15: 'Pets & Animals', 17: 'Sports', 19: 'Travel & Events',
            20: 'Gaming', 22: 'People & Blogs', 23: 'Comedy',
            24: 'Entertainment', 25: 'News & Politics', 26: 'Howto & Style',
            27: 'Education', 28: 'Science & Technology', 29: 'Nonprofits & Activism'
        }
        
        result = []
        for row in rows:
            result.append({
                'video_id': row[0],
                'title': row[1],
                'channel': row[2],
                'category': categories.get(row[3], 'Unknown'),
                'views': int(row[4]) if row[4] else 0,
                'likes': int(row[5]) if row[5] else 0,
                'comments': int(row[6]) if row[6] else 0,
                'engagement_rate': round(row[7], 2) if row[7] else 0,
                'subscribers': int(row[8]) if row[8] else 0,
                'published_at': row[9].strftime('%Y-%m-%d') if row[9] else None
            })
        
        conn.close()
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/duration-analysis")
async def get_duration_analysis():
    """
    Get performance by video duration for scatter/bar charts
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                CASE 
                    WHEN duration_seconds < 60 THEN '0-1 min'
                    WHEN duration_seconds < 180 THEN '1-3 min'
                    WHEN duration_seconds < 300 THEN '3-5 min'
                    WHEN duration_seconds < 600 THEN '5-10 min'
                    WHEN duration_seconds < 1200 THEN '10-20 min'
                    WHEN duration_seconds < 1800 THEN '20-30 min'
                    ELSE '30+ min'
                END as duration_range,
                COUNT(*) as video_count,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views,
                AVG(engagement_rate) as avg_engagement
            FROM ml.videos_dataset
            WHERE duration_seconds IS NOT NULL AND duration_seconds > 0
            GROUP BY 
                CASE 
                    WHEN duration_seconds < 60 THEN '0-1 min'
                    WHEN duration_seconds < 180 THEN '1-3 min'
                    WHEN duration_seconds < 300 THEN '3-5 min'
                    WHEN duration_seconds < 600 THEN '5-10 min'
                    WHEN duration_seconds < 1200 THEN '10-20 min'
                    WHEN duration_seconds < 1800 THEN '20-30 min'
                    ELSE '30+ min'
                END
            ORDER BY 
                CASE 
                    WHEN duration_seconds < 60 THEN 1
                    WHEN duration_seconds < 180 THEN 2
                    WHEN duration_seconds < 300 THEN 3
                    WHEN duration_seconds < 600 THEN 4
                    WHEN duration_seconds < 1200 THEN 5
                    WHEN duration_seconds < 1800 THEN 6
                    ELSE 7
                END
        """
        
        cursor.execute(query)
        rows = cursor.fetchall()
        
        result = []
        for row in rows:
            result.append({
                'duration_range': row[0],
                'video_count': row[1],
                'avg_views': int(row[2]) if row[2] else 0,
                'avg_engagement': round(row[3], 2) if row[3] else 0
            })
        
        conn.close()
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dataset-stats")
async def get_dataset_stats():
    """
    Get overall dataset statistics for dashboard summary cards
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT 
                COUNT(*) as total_videos,
                COUNT(DISTINCT channel_id) as total_channels,
                COUNT(DISTINCT video_category_id) as total_categories,
                SUM(video_view_count) as total_views,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views,
                AVG(engagement_rate) as avg_engagement,
                MIN(video_published_at) as earliest_video,
                MAX(video_published_at) as latest_video
            FROM ml.videos_dataset
        """
        
        cursor.execute(query)
        row = cursor.fetchone()
        
        result = {
            'total_videos': row[0],
            'total_channels': row[1],
            'total_categories': row[2],
            'total_views': int(row[3]) if row[3] else 0,
            'avg_views': int(row[4]) if row[4] else 0,
            'avg_engagement': round(row[5], 2) if row[5] else 0,
            'earliest_video': row[6].strftime('%Y-%m-%d') if row[6] else None,
            'latest_video': row[7].strftime('%Y-%m-%d') if row[7] else None
        }
        
        conn.close()
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/publish-time-analysis")
async def get_publish_time_analysis():
    """
    Get best publishing times (hour of day and day of week)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Hour of day analysis
        hour_query = """
            SELECT 
                DATEPART(HOUR, video_published_at) as hour,
                COUNT(*) as video_count,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views
            FROM ml.videos_dataset
            WHERE video_published_at IS NOT NULL
            GROUP BY DATEPART(HOUR, video_published_at)
            ORDER BY hour
        """
        
        cursor.execute(hour_query)
        hour_rows = cursor.fetchall()
        
        hours = []
        for row in hour_rows:
            hours.append({
                'hour': row[0],
                'video_count': row[1],
                'avg_views': int(row[2]) if row[2] else 0
            })
        
        # Day of week analysis
        day_query = """
            SELECT 
                DATENAME(WEEKDAY, video_published_at) as day_name,
                DATEPART(WEEKDAY, video_published_at) as day_num,
                COUNT(*) as video_count,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views
            FROM ml.videos_dataset
            WHERE video_published_at IS NOT NULL
            GROUP BY DATENAME(WEEKDAY, video_published_at), DATEPART(WEEKDAY, video_published_at)
            ORDER BY day_num
        """
        
        cursor.execute(day_query)
        day_rows = cursor.fetchall()
        
        days = []
        for row in day_rows:
            days.append({
                'day_name': row[0],
                'video_count': row[2],
                'avg_views': int(row[3]) if row[3] else 0
            })
        
        conn.close()
        return {
            'by_hour': hours,
            'by_day': days
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
