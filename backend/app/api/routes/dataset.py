from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional
from app.services.dataset_collector import dataset_collector
from sqlalchemy import text
from app.db.database import SessionLocal
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/collect/trending/{category_id}")
async def collect_trending_data(
    category_id: str,
    background_tasks: BackgroundTasks,
    max_results: int = 50
):
    """Collect trending videos for a category (runs in background)"""
    background_tasks.add_task(
        _collect_and_store_trending,
        category_id,
        max_results
    )
    return {
        "message": f"Started collecting trending videos for category {category_id}",
        "category": dataset_collector.CATEGORIES.get(category_id, "Unknown")
    }

@router.post("/collect/channel/{channel_id}")
async def collect_channel_data(
    channel_id: str,
    background_tasks: BackgroundTasks,
    max_results: int = 50
):
    """Collect videos from a specific channel (runs in background)"""
    background_tasks.add_task(
        _collect_and_store_channel,
        channel_id,
        max_results
    )
    return {
        "message": f"Started collecting videos from channel {channel_id}"
    }

@router.post("/collect/categories-below-threshold")
async def collect_categories_below_threshold(threshold: int = 50, seed: int = None):
    """Collect videos only for categories with less than threshold videos"""
    try:
        import random
        if seed is not None:
            random.seed(seed)
        
        db = SessionLocal()
        try:
            # Get category counts
            result = db.execute(text("""
                SELECT category_id, category_name, COUNT(*) as count
                FROM ml.videos_dataset
                GROUP BY category_id, category_name
            """))
            
            category_counts = {row[0]: (row[1], row[2]) for row in result}
        finally:
            db.close()
        
        # Find categories below threshold
        categories_to_collect = []
        for cat_id, cat_name in dataset_collector.CATEGORIES.items():
            current_count = category_counts.get(cat_id, (cat_name, 0))[1]
            if current_count < threshold:
                categories_to_collect.append((cat_id, cat_name, current_count))
        
        collected = 0
        errors = []
        
        for category_id, category_name, current_count in categories_to_collect:
            try:
                print(f"\n=== Collecting {category_name} (currently {current_count}) ===")
                videos = await dataset_collector.collect_trending_videos(category_id, 50)
                print(f"Retrieved {len(videos)} videos from API")
                
                db = SessionLocal()
                inserted = 0
                try:
                    for video in videos:
                        try:
                            result = db.execute(text("""
                                INSERT INTO ml.videos_dataset (
                                    video_id, title, description, channel_id, channel_title,
                                    category_id, category_name, published_at, thumbnail_url,
                                    duration_seconds, view_count, like_count, comment_count,
                                    engagement_rate, subscriber_count, subscriber_range, tags)
                                SELECT :video_id, :title, :description, :channel_id, :channel_title,
                                    :category_id, :category_name, :published_at, :thumbnail_url,
                                    :duration_seconds, :view_count, :like_count, :comment_count,
                                    :engagement_rate, :subscriber_count, :subscriber_range, :tags
                                WHERE NOT EXISTS (SELECT 1 FROM ml.videos_dataset WHERE video_id = :video_id)
                            """), {
                                "video_id": video["video_id"],
                                "title": video["title"],
                                "description": video["description"][:4000] if video["description"] else "",
                                "channel_id": video["channel_id"],
                                "channel_title": video["channel_title"],
                                "category_id": video["category_id"],
                                "category_name": dataset_collector.CATEGORIES.get(video["category_id"], "Unknown"),
                                "published_at": video["published_at"],
                                "thumbnail_url": video["thumbnail_url"],
                                "duration_seconds": video["duration_seconds"],
                                "view_count": video["view_count"],
                                "like_count": video["like_count"],
                                "comment_count": video["comment_count"],
                                "engagement_rate": video["engagement_rate"],
                                "subscriber_count": video.get("subscriber_count"),
                                "subscriber_range": video.get("subscriber_range"),
                                "tags": str(video["tags"]) if video["tags"] else "[]"
                            })
                            if result.rowcount > 0:
                                inserted += 1
                        except Exception as e:
                            print(f"Error inserting video {video.get('video_id', 'unknown')}: {e}")
                            errors.append(f"Video insert error: {str(e)}")
                            
                    db.commit()
                    collected += inserted
                    print(f"✓ Inserted {inserted} new videos for {category_name} ({len(videos) - inserted} duplicates)")
                finally:
                    db.close()
            except Exception as e:
                error_msg = f"{category_name}: {str(e)}"
                errors.append(error_msg)
                print(f"✗ {error_msg}")
        
        return {
            "message": f"Collection complete for categories below {threshold}",
            "videos_collected": collected,
            "categories_processed": len(categories_to_collect),
            "categories": [f"{name} ({count})" for _, name, count in categories_to_collect],
            "errors": errors if errors else None
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collect/all-categories")
async def collect_all_categories(background_tasks: BackgroundTasks):
    """Collect trending videos from all categories"""
    try:
        collected = 0
        errors = []
        
        for category_id in dataset_collector.CATEGORIES.keys():
            try:
                print(f"\n=== Collecting category {category_id} ===")
                videos = await dataset_collector.collect_trending_videos(category_id, 50)
                print(f"Retrieved {len(videos)} videos from API")
                
                db = SessionLocal()
                inserted = 0
                try:
                    for video in videos:
                        try:
                            result = db.execute(text("""
                                INSERT INTO ml.videos_dataset (
                                    video_id, title, description, channel_id, channel_title,
                                    category_id, category_name, published_at, thumbnail_url,
                                    duration_seconds, view_count, like_count, comment_count,
                                    engagement_rate, subscriber_count, subscriber_range, tags)
                                SELECT :video_id, :title, :description, :channel_id, :channel_title,
                                    :category_id, :category_name, :published_at, :thumbnail_url,
                                    :duration_seconds, :view_count, :like_count, :comment_count,
                                    :engagement_rate, :subscriber_count, :subscriber_range, :tags
                                WHERE NOT EXISTS (SELECT 1 FROM ml.videos_dataset WHERE video_id = :video_id)
                            """), {
                                "video_id": video["video_id"],
                                "title": video["title"],
                                "description": video["description"][:4000] if video["description"] else "",
                                "channel_id": video["channel_id"],
                                "channel_title": video["channel_title"],
                                "category_id": video["category_id"],
                                "category_name": dataset_collector.CATEGORIES.get(video["category_id"], "Unknown"),
                                "published_at": video["published_at"],
                                "thumbnail_url": video["thumbnail_url"],
                                "duration_seconds": video["duration_seconds"],
                                "view_count": video["view_count"],
                                "like_count": video["like_count"],
                                "comment_count": video["comment_count"],
                                "engagement_rate": video["engagement_rate"],
                                "subscriber_count": video.get("subscriber_count"),
                                "subscriber_range": video.get("subscriber_range"),
                                "tags": str(video["tags"]) if video["tags"] else "[]"
                            })
                            if result.rowcount > 0:
                                inserted += 1
                        except Exception as e:
                            print(f"Error inserting video {video.get('video_id', 'unknown')}: {e}")
                            errors.append(f"Video insert error: {str(e)}")
                            
                    db.commit()
                    collected += inserted
                    print(f"✓ Inserted {inserted} new videos for category {category_id} ({len(videos) - inserted} duplicates)")
                finally:
                    db.close()
            except Exception as e:
                error_msg = f"Category {category_id}: {str(e)}"
                errors.append(error_msg)
                print(f"✗ {error_msg}")
        
        return {
            "message": f"Collection complete",
            "videos_collected": collected,
            "categories_processed": len(dataset_collector.CATEGORIES),
            "errors": errors if errors else None
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collect/video/{video_id}")
async def collect_single_video(video_id: str):
    """Manually add a single video by video ID"""
    try:
        import httpx
        from app.core.config import settings
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Get video details
            response = await client.get(
                f"https://www.googleapis.com/youtube/v3/videos",
                params={
                    "part": "snippet,statistics,contentDetails",
                    "id": video_id,
                    "key": settings.YOUTUBE_API_KEY
                }
            )
            data = response.json()
            
            if "items" not in data or not data["items"]:
                raise HTTPException(status_code=404, detail="Video not found")
            
            video = data["items"][0]
            channel_id = video["snippet"]["channelId"]
            
            # Get channel subscriber count
            channel_response = await client.get(
                f"https://www.googleapis.com/youtube/v3/channels",
                params={
                    "part": "statistics",
                    "id": channel_id,
                    "key": settings.YOUTUBE_API_KEY
                }
            )
            channel_data = channel_response.json()
            subscriber_count = 0
            if "items" in channel_data and channel_data["items"]:
                sub_count = channel_data["items"][0]["statistics"].get("subscriberCount")
                if sub_count:
                    try:
                        subscriber_count = int(sub_count)
                    except:
                        pass
            
            # Extract video features
            video_data = await dataset_collector._extract_video_features(video, subscriber_count)
            
            if not video_data:
                raise HTTPException(status_code=500, detail="Failed to extract video features")
            
            # Insert into database
            db = SessionLocal()
            try:
                result = db.execute(text("""
                    INSERT INTO ml.videos_dataset (
                        video_id, title, description, channel_id, channel_title,
                        category_id, category_name, published_at, thumbnail_url,
                        duration_seconds, view_count, like_count, comment_count,
                        engagement_rate, subscriber_count, subscriber_range, tags)
                    SELECT :video_id, :title, :description, :channel_id, :channel_title,
                        :category_id, :category_name, :published_at, :thumbnail_url,
                        :duration_seconds, :view_count, :like_count, :comment_count,
                        :engagement_rate, :subscriber_count, :subscriber_range, :tags
                    WHERE NOT EXISTS (SELECT 1 FROM ml.videos_dataset WHERE video_id = :video_id)
                """), {
                    "video_id": video_data["video_id"],
                    "title": video_data["title"],
                    "description": video_data["description"][:4000] if video_data["description"] else "",
                    "channel_id": video_data["channel_id"],
                    "channel_title": video_data["channel_title"],
                    "category_id": video_data["category_id"],
                    "category_name": dataset_collector.CATEGORIES.get(video_data["category_id"], "Unknown"),
                    "published_at": video_data["published_at"],
                    "thumbnail_url": video_data["thumbnail_url"],
                    "duration_seconds": video_data["duration_seconds"],
                    "view_count": video_data["view_count"],
                    "like_count": video_data["like_count"],
                    "comment_count": video_data["comment_count"],
                    "engagement_rate": video_data["engagement_rate"],
                    "subscriber_count": video_data.get("subscriber_count"),
                    "subscriber_range": video_data.get("subscriber_range"),
                    "tags": str(video_data["tags"]) if video_data["tags"] else "[]"
                })
                db.commit()
                
                if result.rowcount > 0:
                    return {"message": "Video added successfully", "video": video_data}
                else:
                    return {"message": "Video already exists", "video": video_data}
            finally:
                db.close()
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_dataset_stats():
    """Get statistics about collected dataset"""
    db = SessionLocal()
    try:
        result = db.execute(text("""
            SELECT 
                category_id,
                category_name,
                subscriber_range,
                COUNT(*) as video_count,
                AVG(view_count) as avg_views,
                AVG(engagement_rate) as avg_engagement
            FROM ml.videos_dataset
            GROUP BY category_id, category_name, subscriber_range
            ORDER BY category_id, subscriber_range
        """))
        
        stats = []
        for row in result:
            stats.append({
                "category_id": row[0],
                "category_name": row[1],
                "subscriber_range": row[2],
                "video_count": row[3],
                "avg_views": float(row[4]) if row[4] else 0,
                "avg_engagement": float(row[5]) if row[5] else 0
            })
        
        total_result = db.execute(text("SELECT COUNT(*) FROM ml.videos_dataset"))
        total_videos = total_result.scalar()
        
        return {
            "total_videos": total_videos,
            "breakdown": stats
        }
    finally:
        db.close()

async def _collect_and_store_trending(category_id: str, max_results: int):
    """Background task to collect and store trending videos"""
    try:
        logger.info(f"Starting collection for category {category_id}")
        videos = await dataset_collector.collect_trending_videos(category_id, max_results)
        logger.info(f"Collected {len(videos)} videos for category {category_id}")
        
        db = SessionLocal()
        try:
            for video in videos:
                # Insert video data
                db.execute(text("""
                    IF NOT EXISTS (SELECT 1 FROM ml.videos_dataset WHERE video_id = :video_id)
                    INSERT INTO ml.videos_dataset (
                        video_id, title, description, channel_id, channel_title,
                        category_id, category_name, published_at, thumbnail_url,
                        duration_seconds, view_count, like_count, comment_count,
                        engagement_rate, subscriber_count, subscriber_range, tags
                    ) VALUES (
                        :video_id, :title, :description, :channel_id, :channel_title,
                        :category_id, :category_name, :published_at, :thumbnail_url,
                        :duration_seconds, :view_count, :like_count, :comment_count,
                        :engagement_rate, :subscriber_count, :subscriber_range, :tags
                    )
                """), {
                    "video_id": video["video_id"],
                    "title": video["title"],
                    "description": video["description"][:4000] if video["description"] else "",
                    "channel_id": video["channel_id"],
                    "channel_title": video["channel_title"],
                    "category_id": video["category_id"],
                    "category_name": dataset_collector.CATEGORIES.get(video["category_id"], "Unknown"),
                    "published_at": video["published_at"],
                    "thumbnail_url": video["thumbnail_url"],
                    "duration_seconds": video["duration_seconds"],
                    "view_count": video["view_count"],
                    "like_count": video["like_count"],
                    "comment_count": video["comment_count"],
                    "engagement_rate": video["engagement_rate"],
                    "subscriber_count": video.get("subscriber_count"),
                    "subscriber_range": video.get("subscriber_range"),
                    "tags": str(video["tags"]) if video["tags"] else "[]"
                })
            
            db.commit()
            logger.info(f"✓ Stored {len(videos)} videos for category {category_id}")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"✗ Error collecting category {category_id}: {e}")

async def _collect_and_store_channel(channel_id: str, max_results: int):
    """Background task to collect and store channel videos"""
    try:
        videos = await dataset_collector.collect_channel_videos(channel_id, max_results)
        
        db = SessionLocal()
        try:
            for video in videos:
                db.execute(text("""
                    IF NOT EXISTS (SELECT 1 FROM ml.videos_dataset WHERE video_id = :video_id)
                    INSERT INTO ml.videos_dataset (
                        video_id, title, description, channel_id, channel_title,
                        category_id, category_name, published_at, thumbnail_url,
                        duration_seconds, view_count, like_count, comment_count,
                        engagement_rate, subscriber_count, subscriber_range, tags
                    ) VALUES (
                        :video_id, :title, :description, :channel_id, :channel_title,
                        :category_id, :category_name, :published_at, :thumbnail_url,
                        :duration_seconds, :view_count, :like_count, :comment_count,
                        :engagement_rate, :subscriber_count, :subscriber_range, :tags
                    )
                """), {
                    "video_id": video["video_id"],
                    "title": video["title"],
                    "description": video["description"][:4000] if video["description"] else "",
                    "channel_id": video["channel_id"],
                    "channel_title": video["channel_title"],
                    "category_id": video["category_id"],
                    "category_name": dataset_collector.CATEGORIES.get(video["category_id"], "Unknown"),
                    "published_at": video["published_at"],
                    "thumbnail_url": video["thumbnail_url"],
                    "duration_seconds": video["duration_seconds"],
                    "view_count": video["view_count"],
                    "like_count": video["like_count"],
                    "comment_count": video["comment_count"],
                    "engagement_rate": video["engagement_rate"],
                    "subscriber_count": video.get("subscriber_count"),
                    "subscriber_range": video.get("subscriber_range"),
                    "tags": str(video["tags"]) if video["tags"] else "[]"
                })
            
            db.commit()
            print(f"✓ Stored {len(videos)} videos from channel {channel_id}")
        finally:
            db.close()
    except Exception as e:
        print(f"✗ Error collecting channel {channel_id}: {e}")
