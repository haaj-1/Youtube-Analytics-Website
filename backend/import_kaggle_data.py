import kagglehub
from kagglehub import KaggleDatasetAdapter
import pyodbc
import pandas as pd
import re
from datetime import datetime

def parse_duration(duration_str):
    """Parse ISO 8601 duration to seconds (PT10M15S -> 615)"""
    if not duration_str or duration_str == 'PT0S':
        return 0
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration_str)
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds

def get_subscriber_range(count):
    """Map subscriber count to range"""
    if count == 0 or count is None:
        return '0-1K'
    elif count < 1000:
        return '0-1K'
    elif count < 10000:
        return '1K-10K'
    elif count < 50000:
        return '10K-50K'
    elif count < 100000:
        return '50K-100K'
    elif count < 250000:
        return '100K-250K'
    elif count < 500000:
        return '250K-500K'
    elif count < 1000000:
        return '500K-1M'
    elif count < 10000000:
        return '1M-10M'
    else:
        return '10M+'

def get_category_name(category_value):
    """Map category ID or name to standardized name"""
    # If it's already a name, return it
    if isinstance(category_value, str):
        return category_value
    
    # If it's NaN, return Unknown
    if pd.isna(category_value):
        return 'Unknown'
    
    # If it's a number, map to name
    categories = {
        1: 'Film & Animation', 2: 'Autos & Vehicles', 10: 'Music',
        15: 'Pets & Animals', 17: 'Sports', 19: 'Travel & Events',
        20: 'Gaming', 22: 'People & Blogs', 23: 'Comedy',
        24: 'Entertainment', 25: 'News & Politics', 26: 'Howto & Style',
        27: 'Education', 28: 'Science & Technology', 29: 'Nonprofits & Activism'
    }
    return categories.get(int(category_value), 'Unknown')

def get_category_id(category_value):
    """Get numeric category ID from name or ID"""
    # If it's already a number, return it
    if isinstance(category_value, (int, float)) and not pd.isna(category_value):
        return int(category_value)
    
    # If it's NaN, return 0
    if pd.isna(category_value):
        return 0
    
    # Map name to ID
    name_to_id = {
        'Film & Animation': 1, 'Autos & Vehicles': 2, 'Music': 10,
        'Pets & Animals': 15, 'Sports': 17, 'Travel & Events': 19,
        'Gaming': 20, 'People & Blogs': 22, 'Comedy': 23,
        'Entertainment': 24, 'News & Politics': 25, 'Howto & Style': 26,
        'Education': 27, 'Science & Technology': 28, 'Nonprofits & Activism': 29
    }
    return name_to_id.get(str(category_value), 0)

def import_kaggle_data(batch_size=1000, sample_size=50000):
    print("Downloading dataset from Kaggle...")
    
    # First, download the dataset to see available files
    import kagglehub
    dataset_path = kagglehub.dataset_download("canerkonuk/youtube-trending-videos-global")
    print(f"Dataset downloaded to: {dataset_path}")
    
    # List files in the dataset
    import os
    files = os.listdir(dataset_path)
    print(f"Available files: {files}")
    
    # Find CSV file
    csv_file = [f for f in files if f.endswith('.csv')][0]
    print(f"Loading file: {csv_file}")
    
    # Load the CSV
    import pandas as pd
    df = pd.read_csv(os.path.join(dataset_path, csv_file))
    
    print(f"Loaded {len(df)} rows")
    print(f"Columns: {df.columns.tolist()}")
    
    # Sample data for faster processing
    if sample_size and len(df) > sample_size:
        print(f"Sampling {sample_size} random rows from {len(df)} total rows...")
        df = df.sample(n=sample_size, random_state=42)
        print(f"Sampled dataset size: {len(df)} rows")
    
    # Filter out rows with missing critical data
    print(f"Before filtering: {len(df)} rows")
    df = df.dropna(subset=['video_id', 'video_title', 'video_view_count'])
    print(f"After dropna: {len(df)} rows")
    
    # Only filter subscriber count if column exists
    if 'channel_subscriber_count' in df.columns:
        df = df[df['channel_subscriber_count'].notna()]
        print(f"After subscriber filter: {len(df)} rows")
    
    print(f"After filtering: {len(df)} rows")
    
    # Connect to database
    import os
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise Exception("DATABASE_URL environment variable not found")
    
    # Parse the DATABASE_URL to extract server and database name
    # Format: mssql+pyodbc://SERVER/DATABASE?driver=...
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
    
    # Prepare insert query with ALL Kaggle columns
    insert_query = """
        INSERT INTO ml.videos_dataset 
        (video_id, video_title, video_description, video_published_at, video_trending_date,
         video_trending_country, video_default_thumbnail, video_category_id, video_tags,
         video_duration, video_dimension, video_definition, video_licensed_content,
         video_view_count, video_like_count, video_comment_count,
         channel_id, channel_title, channel_description, channel_custom_url,
         channel_published_at, channel_country, channel_view_count, channel_subscriber_count,
         channel_have_hidden_subscribers, channel_video_count, channel_localized_title,
         channel_localized_description, duration_seconds, engagement_rate, subscriber_range,
         collected_at)
        SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (SELECT 1 FROM ml.videos_dataset WHERE video_id = ?)
    """
    
    inserted = 0
    skipped = 0
    
    for idx, row in df.iterrows():
        try:
            # Parse duration
            duration_seconds = parse_duration(row.get('video_duration', 'PT0S'))
            
            # Calculate engagement rate
            views = float(row.get('video_view_count', 0)) if pd.notna(row.get('video_view_count')) else 0
            likes = float(row.get('video_like_count', 0)) if pd.notna(row.get('video_like_count')) else 0
            comments = float(row.get('video_comment_count', 0)) if pd.notna(row.get('video_comment_count')) else 0
            engagement_rate = ((likes + comments) / views * 100) if views > 0 else 0
            
            # Get subscriber info
            subscriber_count = float(row.get('channel_subscriber_count', 0)) if pd.notna(row.get('channel_subscriber_count')) else 0
            subscriber_range = get_subscriber_range(int(subscriber_count))
            
            # Get category ID
            category_id = get_category_id(row.get('video_category_id', 0))
            
            # Parse dates
            video_published_at = None
            if 'video_published_at' in row and pd.notna(row.get('video_published_at')):
                try:
                    video_published_at = pd.to_datetime(row['video_published_at'])
                except:
                    pass
            
            video_trending_date = None
            if 'video_trending_date' in row and pd.notna(row.get('video_trending_date')):
                try:
                    video_trending_date = pd.to_datetime(row['video_trending_date']).date()
                except:
                    pass
            
            channel_published_at = None
            if 'channel_published_at' in row and pd.notna(row.get('channel_published_at')):
                try:
                    channel_published_at = pd.to_datetime(row['channel_published_at'])
                except:
                    pass
            
            # Prepare values (32 values + 1 for WHERE NOT EXISTS)
            values = (
                row['video_id'],
                str(row.get('video_title', ''))[:500],
                str(row.get('video_description', ''))[:4000],
                video_published_at,
                video_trending_date,
                str(row.get('video_trending_country', ''))[:10],
                str(row.get('video_default_thumbnail', ''))[:500],
                category_id,
                str(row.get('video_tags', ''))[:4000],
                str(row.get('video_duration', ''))[:50],
                str(row.get('video_dimension', ''))[:10],
                str(row.get('video_definition', ''))[:10],
                bool(row.get('video_licensed_content', False)) if pd.notna(row.get('video_licensed_content')) else False,
                int(views),
                int(likes),
                int(comments),
                str(row.get('channel_id', ''))[:50],
                str(row.get('channel_title', ''))[:200],
                str(row.get('channel_description', ''))[:4000],
                str(row.get('channel_custom_url', ''))[:200],
                channel_published_at,
                str(row.get('channel_country', ''))[:50],
                int(float(row.get('channel_view_count', 0))) if pd.notna(row.get('channel_view_count')) else 0,
                int(subscriber_count),
                bool(row.get('channel_have_hidden_subscribers', False)) if pd.notna(row.get('channel_have_hidden_subscribers')) else False,
                int(float(row.get('channel_video_count', 0))) if pd.notna(row.get('channel_video_count')) else 0,
                str(row.get('channel_localized_title', ''))[:200],
                str(row.get('channel_localized_description', ''))[:4000],
                duration_seconds,
                round(engagement_rate, 2),
                subscriber_range,
                datetime.now(),
                row['video_id']  # For WHERE NOT EXISTS check
            )
            
            cursor.execute(insert_query, values)
            result = cursor.rowcount
            
            if result > 0:
                inserted += 1
            else:
                skipped += 1
            
            # Commit in batches
            if (idx + 1) % batch_size == 0:
                conn.commit()
                print(f"Processed {idx + 1}/{len(df)} rows (Inserted: {inserted}, Skipped: {skipped})")
        
        except Exception as e:
            print(f"Error on row {idx}: {e}")
            continue
    
    # Final commit
    conn.commit()
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 50)
    print("Import Complete!")
    print(f"Total inserted: {inserted}")
    print(f"Total skipped (duplicates): {skipped}")
    print("=" * 50)

if __name__ == "__main__":
    # Use 80K videos for improved model performance
    import_kaggle_data(sample_size=80000)
