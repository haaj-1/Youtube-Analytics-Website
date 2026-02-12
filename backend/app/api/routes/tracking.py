from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import pyodbc
import os

router = APIRouter()

class VideoTrackRequest(BaseModel):
    video_id: str
    title: str
    predicted_views: int
    actual_views: int
    category_id: int
    subscriber_count: int
    published_at: datetime

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

@router.post("/track-video")
async def track_video_performance(request: VideoTrackRequest):
    """Track predicted vs actual performance"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create tracking table if not exists
        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'video_tracking')
            CREATE TABLE ml.video_tracking (
                tracking_id INT IDENTITY(1,1) PRIMARY KEY,
                video_id VARCHAR(50),
                title NVARCHAR(500),
                predicted_views INT,
                actual_views INT,
                accuracy_percent FLOAT,
                category_id INT,
                subscriber_count BIGINT,
                published_at DATETIME,
                tracked_at DATETIME DEFAULT GETUTCDATE()
            )
        """)
        
        accuracy = (1 - abs(request.actual_views - request.predicted_views) / request.predicted_views) * 100
        
        cursor.execute("""
            INSERT INTO ml.video_tracking 
            (video_id, title, predicted_views, actual_views, accuracy_percent, 
             category_id, subscriber_count, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (request.video_id, request.title, request.predicted_views, 
              request.actual_views, accuracy, request.category_id, 
              request.subscriber_count, request.published_at))
        
        conn.commit()
        conn.close()
        
        return {
            'video_id': request.video_id,
            'predicted_views': request.predicted_views,
            'actual_views': request.actual_views,
            'accuracy_percent': round(accuracy, 2),
            'status': 'success'
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tracking-stats")
async def get_tracking_stats():
    """Get overall prediction accuracy stats"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                COUNT(*) as total_tracked,
                AVG(accuracy_percent) as avg_accuracy,
                MIN(accuracy_percent) as min_accuracy,
                MAX(accuracy_percent) as max_accuracy,
                AVG(CAST(predicted_views AS FLOAT)) as avg_predicted,
                AVG(CAST(actual_views AS FLOAT)) as avg_actual
            FROM ml.video_tracking
        """)
        
        row = cursor.fetchone()
        conn.close()
        
        if not row or not row[0]:
            return {
                'total_tracked': 0,
                'message': 'No tracked videos yet'
            }
        
        return {
            'total_tracked': row[0],
            'avg_accuracy_percent': round(row[1], 2) if row[1] else 0,
            'min_accuracy_percent': round(row[2], 2) if row[2] else 0,
            'max_accuracy_percent': round(row[3], 2) if row[3] else 0,
            'avg_predicted_views': int(row[4]) if row[4] else 0,
            'avg_actual_views': int(row[5]) if row[5] else 0
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tracked-videos")
async def get_tracked_videos(limit: int = 20):
    """Get list of tracked videos"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(f"""
            SELECT TOP {limit}
                video_id, title, predicted_views, actual_views, 
                accuracy_percent, published_at, tracked_at
            FROM ml.video_tracking
            ORDER BY tracked_at DESC
        """)
        
        rows = cursor.fetchall()
        conn.close()
        
        results = []
        for row in rows:
            results.append({
                'video_id': row[0],
                'title': row[1],
                'predicted_views': row[2],
                'actual_views': row[3],
                'accuracy_percent': round(row[4], 2),
                'published_at': row[5].strftime('%Y-%m-%d') if row[5] else None,
                'tracked_at': row[6].strftime('%Y-%m-%d') if row[6] else None
            })
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
