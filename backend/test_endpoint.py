import asyncio
from app.services.dataset_collector import dataset_collector

async def test():
    try:
        print("Testing collect_trending_videos...")
        videos = await dataset_collector.collect_trending_videos("1", 5)
        print(f"Success! Got {len(videos)} videos")
        if videos:
            print(f"First video: {videos[0].get('title', 'No title')}")
            print(f"Has subscriber_range: {'subscriber_range' in videos[0]}")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
