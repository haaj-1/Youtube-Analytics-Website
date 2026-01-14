-- Analytics Tables
-- =============================================
CREATE TABLE analytics.post_features (
    feature_id INT IDENTITY(1,1) PRIMARY KEY,
    post_id INT NOT NULL FOREIGN KEY REFERENCES ingestion.raw_instagram_posts(post_id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES auth.users(user_id),
    engagement INT DEFAULT 0,
    engagement_rate FLOAT,
    posting_hour INT,
    day_of_week INT,
    caption_length INT,
    hashtag_count INT,
    rolling_avg_engagement_7d FLOAT,
    rolling_avg_engagement_30d FLOAT,
    sentiment_score FLOAT,
    num_trending_words INT
);
GO

CREATE TABLE analytics.content_patterns (
    pattern_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES auth.users(user_id),
    pattern_type NVARCHAR(50), -- posting_hour, media_type, sentiment, hashtag_count
    pattern_value NVARCHAR(255),
    avg_engagement FLOAT,
    sample_size INT,
    last_updated DATETIME2 DEFAULT GETDATE()
);
GO

CREATE TABLE analytics.platform_trends (
    trend_id INT IDENTITY(1,1) PRIMARY KEY,
    dimension NVARCHAR(50), -- posting_hour, media_type, sentiment
    dimension_value NVARCHAR(255),
    avg_engagement FLOAT,
    trend_window_days INT,
    source NVARCHAR(50) -- simulated / public
);
GO