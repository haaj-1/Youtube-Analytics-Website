USE prepost_analytics;
GO

-- Create ml schema if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'ml')
    EXEC('CREATE SCHEMA ml');
GO

/*****************************************************************************************
SECTION 4 — MACHINE LEARNING DATASET (ml)
------------------------------------------------------------------------------------------
Purpose:
- Store YouTube video data for ML model training
- Track video features (thumbnails, text, engagement metrics)
- Store model predictions and metadata
- Support performance analysis by category and subscriber range
*****************************************************************************************/

-- Drop existing tables if they exist (in reverse order due to foreign keys)
IF OBJECT_ID('ml.model_metadata', 'U') IS NOT NULL DROP TABLE ml.model_metadata;
IF OBJECT_ID('ml.predictions', 'U') IS NOT NULL DROP TABLE ml.predictions;
IF OBJECT_ID('ml.text_features', 'U') IS NOT NULL DROP TABLE ml.text_features;
IF OBJECT_ID('ml.thumbnail_features', 'U') IS NOT NULL DROP TABLE ml.thumbnail_features;
IF OBJECT_ID('ml.videos_dataset', 'U') IS NOT NULL DROP TABLE ml.videos_dataset;
GO

-- Videos dataset table
CREATE TABLE ml.videos_dataset (
    dataset_id INT IDENTITY(1,1) PRIMARY KEY,
    video_id VARCHAR(50) NOT NULL,
    title NVARCHAR(500),
    description NVARCHAR(MAX),
    channel_id VARCHAR(50),
    channel_title NVARCHAR(200),
    category_id VARCHAR(10),
    category_name VARCHAR(100),
    published_at DATETIME,
    thumbnail_url VARCHAR(500),
    duration_seconds INT,
    view_count BIGINT,
    like_count BIGINT,
    comment_count BIGINT,
    engagement_rate FLOAT,
    subscriber_count BIGINT,
    subscriber_range VARCHAR(50),
    tags NVARCHAR(MAX),
    collected_at DATETIME DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_video_id UNIQUE (video_id)
);
GO

-- Thumbnail features table
CREATE TABLE ml.thumbnail_features (
    feature_id INT IDENTITY(1,1) PRIMARY KEY,
    video_id VARCHAR(50) NOT NULL,
    thumbnail_url VARCHAR(500),
    dominant_colors NVARCHAR(500),
    brightness FLOAT,
    contrast FLOAT,
    saturation FLOAT,
    has_text BIT,
    text_area_percentage FLOAT,
    has_faces BIT,
    face_count INT,
    complexity_score FLOAT,
    edge_density FLOAT,
    extracted_at DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (video_id) REFERENCES ml.videos_dataset(video_id)
);
GO

-- Title/Description NLP features
CREATE TABLE ml.text_features (
    feature_id INT IDENTITY(1,1) PRIMARY KEY,
    video_id VARCHAR(50) NOT NULL,
    title_length INT,
    title_word_count INT,
    title_has_numbers BIT,
    title_has_emoji BIT,
    title_sentiment FLOAT,
    title_clickbait_score FLOAT,
    description_length INT,
    description_word_count INT,
    description_has_links BIT,
    description_has_timestamps BIT,
    keywords NVARCHAR(MAX),
    extracted_at DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (video_id) REFERENCES ml.videos_dataset(video_id)
);
GO

-- Performance predictions table
CREATE TABLE ml.predictions (
    prediction_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    video_id VARCHAR(50),
    thumbnail_url VARCHAR(500),
    title NVARCHAR(500),
    description NVARCHAR(MAX),
    category_id VARCHAR(10),
    subscriber_range VARCHAR(50),
    predicted_views BIGINT,
    predicted_engagement_rate FLOAT,
    predicted_ctr FLOAT,
    confidence_score FLOAT,
    recommendations NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETUTCDATE()
);
GO

-- Add foreign key constraint
ALTER TABLE ml.predictions
ADD CONSTRAINT FK_predictions_user FOREIGN KEY (user_id) REFERENCES auth.users(user_id);
GO

-- Model training metadata
CREATE TABLE ml.model_metadata (
    model_id INT IDENTITY(1,1) PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50),
    category_id VARCHAR(10),
    subscriber_range VARCHAR(50),
    training_samples INT,
    validation_accuracy FLOAT,
    model_path VARCHAR(500),
    trained_at DATETIME DEFAULT GETUTCDATE(),
    is_active BIT DEFAULT 1
);
GO

-- Create indexes
CREATE INDEX IX_videos_category ON ml.videos_dataset(category_id);
CREATE INDEX IX_videos_subscriber_range ON ml.videos_dataset(subscriber_range);
CREATE INDEX IX_videos_collected_at ON ml.videos_dataset(collected_at);
CREATE INDEX IX_predictions_user ON ml.predictions(user_id);
CREATE INDEX IX_predictions_created ON ml.predictions(created_at);
GO
