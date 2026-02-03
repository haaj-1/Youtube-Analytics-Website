-- sql/youtube_data_schema.sql
-- YouTube Analytics Database Schema

-- Videos table - main video data
CREATE TABLE videos (
    video_id VARCHAR(20) PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    channel_id VARCHAR(30),
    channel_title VARCHAR(255),
    published_at TIMESTAMP,
    duration_seconds INTEGER,
    category_id INTEGER,
    default_language VARCHAR(10),
    view_count BIGINT DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    title_length INTEGER,
    description_length INTEGER,
    tags_count INTEGER,
    engagement_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channels table - channel statistics
CREATE TABLE channels (
    channel_id VARCHAR(30) PRIMARY KEY,
    channel_title VARCHAR(255),
    subscriber_count BIGINT,
    video_count INTEGER,
    view_count BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video tags table - for hashtag analysis
CREATE TABLE video_tags (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(20) REFERENCES videos(video_id),
    tag VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predictions table - store ML predictions
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(20),
    predicted_views INTEGER,
    predicted_likes INTEGER,
    predicted_comments INTEGER,
    predicted_engagement_rate DECIMAL(5,2),
    actual_views INTEGER,
    actual_likes INTEGER,
    actual_comments INTEGER,
    actual_engagement_rate DECIMAL(5,2),
    prediction_accuracy DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trending data table - track trending patterns
CREATE TABLE trending_data (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(20) REFERENCES videos(video_id),
    region VARCHAR(5),
    category_id INTEGER,
    trending_date DATE,
    rank_position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Model performance table - track ML model metrics
CREATE TABLE model_performance (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100),
    accuracy DECIMAL(5,2),
    mae DECIMAL(10,2),
    rmse DECIMAL(10,2),
    training_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_videos_published_at ON videos(published_at);
CREATE INDEX idx_videos_view_count ON videos(view_count);
CREATE INDEX idx_videos_engagement_rate ON videos(engagement_rate);
CREATE INDEX idx_trending_date ON trending_data(trending_date);
CREATE INDEX idx_video_tags_tag ON video_tags(tag);