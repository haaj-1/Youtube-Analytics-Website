/*****************************************************************************************
SECTION 5 — GOLD LAYER (ML FEATURES & PREDICTIONS)
------------------------------------------------------------------------------------------
Purpose:
- ML-ready feature store
- Model outputs and predictions
- Explainable content insights
*****************************************************************************************/

-- Feature store for ML training & inference
CREATE TABLE gold.post_features (
    feature_id INT IDENTITY(1,1) PRIMARY KEY,
    post_id INT NOT NULL,
    ig_account_id INT NOT NULL,
    posting_hour INT,
    day_of_week INT,
    media_type NVARCHAR(50),
    caption_length INT,
    hashtag_count INT,
    rolling_avg_engagement_7d FLOAT,
    rolling_avg_engagement_30d FLOAT,
    sentiment_score FLOAT,
    caption_embedding VARBINARY(MAX), -- BERT embedding
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT fk_post_features_post
        FOREIGN KEY (post_id) REFERENCES bronze.raw_instagram_posts(post_id)
);
GO

-- Stores ML prediction outputs
CREATE TABLE gold.predictions (
    prediction_id INT IDENTITY(1,1) PRIMARY KEY,
    ig_account_id INT NOT NULL,
    post_id INT NULL, -- NULL for pre-post predictions
    predicted_likes INT,
    predicted_comments INT,
    predicted_engagement INT,
    predicted_impressions INT,
    predicted_reach INT,
    predicted_saves INT,
    predicted_video_views INT,
    confidence_lower FLOAT,
    confidence_upper FLOAT,
    model_version NVARCHAR(50),
    created_at DATETIME2 DEFAULT SYSDATETIME()
);
GO

-- Summarized content patterns for insights
CREATE TABLE gold.content_patterns (
    pattern_id INT IDENTITY(1,1) PRIMARY KEY,
    ig_account_id INT NOT NULL,
    pattern_type NVARCHAR(50),   -- posting_hour, media_type, sentiment
    pattern_value NVARCHAR(100),
    avg_engagement FLOAT,
    sample_size INT,
    last_updated DATETIME2 DEFAULT SYSDATETIME()
);
GO
