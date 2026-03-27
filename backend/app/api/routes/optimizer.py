from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re

router = APIRouter()

class TitleOptimizeRequest(BaseModel):
    base_title: str
    description: str
    category_id: int
    subscriber_count: int
    duration_seconds: int
    thumbnail_url: Optional[str] = None

class TitleVariation(BaseModel):
    title: str
    predicted_views: int
    improvement_percent: float
    confidence: float
    insights: List[str]
    confidence_interval: Optional[dict] = None
    feature_importance: Optional[List[dict]] = None
    similar_videos: Optional[dict] = None
    seasonal_factor: Optional[float] = None

class TitleOptimizeResponse(BaseModel):
    original_views: int
    best_title: str
    best_views: int
    improvement: float
    variations: List[TitleVariation]

def generate_title_variations(base_title: str, category_id: int) -> List[str]:
    """Generate diverse title variations for meaningful prediction differences"""
    variations = [base_title]
    from datetime import datetime
    current_year = datetime.now().year
    
    has_numbers = bool(re.search(r'\d', base_title))
    is_how_to = base_title.lower().startswith('how to')
    
    # Year variation (minimal change)
    if str(current_year) not in base_title:
        variations.append(f"{base_title} ({current_year})")
    
    # Number-based variations (moderate semantic change)
    if not has_numbers:
        if is_how_to:
            variations.extend([
                f"{base_title} in 5 Minutes",
                f"{base_title} - Step by Step Tutorial"
            ])
        else:
            variations.extend([
                f"Top 10 {base_title}",
                f"5 Amazing {base_title} You Need to See"
            ])
    
    # Audience-targeted variations (significant semantic change)
    variations.extend([
        f"{base_title} for Beginners",
        f"Ultimate {base_title} Guide 2025",
        f"Everything You Need to Know About {base_title}"
    ])
    
    # Emotional/clickbait variations (major semantic change)
    variations.extend([
        f"I Tried {base_title} and This Happened",
        f"{base_title} - You Won't Believe This!"
    ])
    
    return list(dict.fromkeys(variations))[:10]

@router.post("/optimize-title", response_model=TitleOptimizeResponse)
async def optimize_title(request: TitleOptimizeRequest):
    """Optimize video title by testing variations with actual ML predictions"""
    try:
        from app.services.prediction_service import PredictionService
        predictor = PredictionService()
        
        title_variations = generate_title_variations(request.base_title, request.category_id)
        
        results = []
        original_views = None
        
        for idx, title in enumerate(title_variations):
            prediction = predictor.predict_performance(
                title=title,
                description=request.description,
                thumbnail_url=request.thumbnail_url or "https://via.placeholder.com/1280x720",
                category_id=request.category_id,
                subscriber_count=request.subscriber_count,
                duration_seconds=request.duration_seconds
            )
            
            # Filter out thumbnail-related factors for NLP Caption Optimizer
            if prediction.get('feature_importance'):
                prediction['feature_importance'] = [
                    f for f in prediction['feature_importance'] 
                    if f.get('type') != 'thumbnail'
                ]
            
            if idx == 0:
                original_views = prediction['predicted_views']
            
            improvement = ((prediction['predicted_views'] - original_views) / original_views * 100) if original_views else 0
            
            # Pass through all new prediction fields
            results.append(TitleVariation(
                title=title,
                predicted_views=prediction['predicted_views'],
                improvement_percent=round(improvement, 1),
                confidence=prediction['confidence_score'],
                insights=[],  # Remove hardcoded assumptions
                confidence_interval=prediction.get('confidence_interval'),
                feature_importance=prediction.get('feature_importance'),
                similar_videos=prediction.get('similar_videos'),
                seasonal_factor=prediction.get('seasonal_factor')
            ))
        
        results.sort(key=lambda x: x.predicted_views, reverse=True)
        best = results[0]
        
        return TitleOptimizeResponse(
            original_views=original_views,
            best_title=best.title,
            best_views=best.predicted_views,
            improvement=round((best.predicted_views - original_views) / original_views * 100, 1),
            variations=results
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare-thumbnails")
async def compare_thumbnails(request: dict):
    """A/B test multiple thumbnails"""
    try:
        from app.services.prediction_service import PredictionService
        predictor = PredictionService()
        
        thumbnails = request.get('thumbnails', [])
        if len(thumbnails) < 2:
            raise HTTPException(status_code=400, detail="Provide at least 2 thumbnails")
        
        results = []
        for idx, thumbnail_url in enumerate(thumbnails):
            prediction = predictor.predict_performance(
                title=request.get('title'),
                description=request.get('description'),
                thumbnail_url=thumbnail_url,
                category_id=request.get('category_id'),
                subscriber_count=request.get('subscriber_count'),
                duration_seconds=request.get('duration_seconds')
            )
            
            results.append({
                'thumbnail_id': idx + 1,
                'thumbnail_url': thumbnail_url,
                'predicted_views': prediction['predicted_views'],
                'confidence': prediction['confidence_score']
            })
        
        results.sort(key=lambda x: x['predicted_views'], reverse=True)
        baseline = results[-1]['predicted_views']
        
        for idx, result in enumerate(results):
            result['rank'] = idx + 1
            result['improvement_vs_worst'] = round((result['predicted_views'] - baseline) / baseline * 100, 1)
        
        return {
            'best_thumbnail': results[0],
            'all_results': results,
            'recommendation': f"Use Thumbnail #{results[0]['thumbnail_id']} - predicts {results[0]['improvement_vs_worst']}% more views"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/best-publish-time")
async def get_best_publish_time(category_id: int, subscriber_range: Optional[str] = None):
    """Find optimal publish time"""
    try:
        import pyodbc
        import os
        
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            raise HTTPException(status_code=500, detail="Database configuration not found")
        
        # Parse the DATABASE_URL to extract server and database name
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
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        hour_query = """
            SELECT TOP 3
                DATEPART(HOUR, video_published_at) as hour,
                COUNT(*) as video_count,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views
            FROM ml.videos_dataset
            WHERE video_published_at IS NOT NULL AND video_category_id = ?
        """
        
        params = [category_id]
        if subscriber_range:
            hour_query += " AND subscriber_range = ?"
            params.append(subscriber_range)
        
        hour_query += """
            GROUP BY DATEPART(HOUR, video_published_at)
            HAVING COUNT(*) >= 10
            ORDER BY avg_views DESC
        """
        
        cursor.execute(hour_query, params)
        hour_rows = cursor.fetchall()
        
        best_hours = []
        for row in hour_rows:
            best_hours.append({
                'hour': row[0],
                'hour_12h': f"{row[0] % 12 or 12}{'AM' if row[0] < 12 else 'PM'}",
                'video_count': row[1],
                'avg_views': int(row[2])
            })
        
        if not best_hours:
            best_hours = [{'hour': 18, 'hour_12h': '6PM', 'video_count': 0, 'avg_views': 0}]
        
        day_query = """
            SELECT TOP 3
                DATENAME(WEEKDAY, video_published_at) as day_name,
                COUNT(*) as video_count,
                AVG(CAST(video_view_count AS FLOAT)) as avg_views
            FROM ml.videos_dataset
            WHERE video_published_at IS NOT NULL AND video_category_id = ?
        """
        
        params = [category_id]
        if subscriber_range:
            day_query += " AND subscriber_range = ?"
            params.append(subscriber_range)
        
        day_query += """
            GROUP BY DATENAME(WEEKDAY, video_published_at)
            HAVING COUNT(*) >= 10
            ORDER BY avg_views DESC
        """
        
        cursor.execute(day_query, params)
        day_rows = cursor.fetchall()
        
        best_days = []
        for row in day_rows:
            best_days.append({
                'day': row[0],
                'video_count': row[1],
                'avg_views': int(row[2])
            })
        
        if not best_days:
            best_days = [{'day': 'Saturday', 'video_count': 0, 'avg_views': 0}]
        
        conn.close()
        
        return {
            'best_hours': best_hours,
            'best_days': best_days,
            'recommendation': f"Publish on {best_days[0]['day']} at {best_hours[0]['hour_12h']} for best results" if best_hours[0]['video_count'] > 0 else "Not enough data for this category/subscriber range"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending-keywords")
async def get_trending_keywords(category_id: int, limit: int = 20):
    """Get trending keywords in category"""
    try:
        import pyodbc
        from collections import Counter
        import re
        import os
        
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            raise HTTPException(status_code=500, detail="Database configuration not found")
        
        # Parse the DATABASE_URL to extract server and database name
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
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        query = """
            SELECT video_title, video_view_count
            FROM ml.videos_dataset
            WHERE video_category_id = ?
                AND video_trending_date >= DATEADD(day, -30, GETDATE())
            ORDER BY video_view_count DESC
        """
        
        cursor.execute(query, (category_id,))
        rows = cursor.fetchall()
        conn.close()
        
        # Extract keywords
        all_words = []
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were'}
        
        for row in rows:
            title = row[0].lower()
            words = re.findall(r'\b[a-z]{3,}\b', title)
            all_words.extend([w for w in words if w not in stop_words])
        
        # Count frequency
        word_counts = Counter(all_words)
        trending = [{'keyword': word, 'frequency': count} for word, count in word_counts.most_common(limit)]
        
        return {
            'category_id': category_id,
            'period': 'Last 30 days',
            'trending_keywords': trending
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
