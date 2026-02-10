USE prepost_analytics;
GO

-- Drop dependent tables first
IF OBJECT_ID('ml.text_features', 'U') IS NOT NULL DROP TABLE ml.text_features;
IF OBJECT_ID('ml.thumbnail_features', 'U') IS NOT NULL DROP TABLE ml.thumbnail_features;
GO

-- Drop existing table and recreate with Kaggle schema
IF OBJECT_ID('ml.videos_dataset', 'U') IS NOT NULL DROP TABLE ml.videos_dataset;
GO

-- Videos dataset table matching Kaggle structure
CREATE TABLE ml.videos_dataset (
    dataset_id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Video info
    video_id VARCHAR(50) NOT NULL UNIQUE,
    video_title NVARCHAR(500),
    video_description NVARCHAR(MAX),
    video_published_at DATETIME,
    video_trending_date DATE,
    video_trending_country VARCHAR(10),
    video_default_thumbnail VARCHAR(500),
    video_category_id INT,
    video_tags NVARCHAR(MAX),
    video_duration VARCHAR(50),
    video_dimension VARCHAR(10),
    video_definition VARCHAR(10),
    video_licensed_content BIT,
    video_view_count BIGINT,
    video_like_count BIGINT,
    video_comment_count BIGINT,
    
    -- Channel info
    channel_id VARCHAR(50),
    channel_title NVARCHAR(200),
    channel_description NVARCHAR(MAX),
    channel_custom_url VARCHAR(200),
    channel_published_at DATETIME,
    channel_country VARCHAR(50),
    channel_view_count BIGINT,
    channel_subscriber_count BIGINT,
    channel_have_hidden_subscribers BIT,
    channel_video_count INT,
    channel_localized_title NVARCHAR(200),
    channel_localized_description NVARCHAR(MAX),
    
    -- Calculated fields
    duration_seconds INT,
    engagement_rate FLOAT,
    subscriber_range VARCHAR(50),
    
    -- Metadata
    collected_at DATETIME DEFAULT GETUTCDATE()
);
GO

-- Create indexes
CREATE INDEX IX_videos_video_id ON ml.videos_dataset(video_id);
CREATE INDEX IX_videos_category ON ml.videos_dataset(video_category_id);
CREATE INDEX IX_videos_published ON ml.videos_dataset(video_published_at);
CREATE INDEX IX_videos_trending ON ml.videos_dataset(video_trending_date);
CREATE INDEX IX_videos_country ON ml.videos_dataset(video_trending_country);
CREATE INDEX IX_videos_channel ON ml.videos_dataset(channel_id);
CREATE INDEX IX_videos_subscribers ON ml.videos_dataset(channel_subscriber_count);
GO
