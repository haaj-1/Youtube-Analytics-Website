/*****************************************************************************************
SECTION 4 — SILVER LAYER (CLEANED ANALYTICS)
------------------------------------------------------------------------------------------
Purpose:
- Clean, normalize, and aggregate Bronze data
- Support dashboards and analytical queries
- Contains business logic and derived metrics
*****************************************************************************************/

-- Cleaned per-post performance table
CREATE TABLE silver.post_performance (
    post_id INT PRIMARY KEY,
    ig_account_id INT NOT NULL,
    caption NVARCHAR(MAX),
    media_type NVARCHAR(50),
    posted_at DATETIME2,
    posting_hour INT,
    day_of_week INT,
    like_count INT,
    comments_count INT,
    saved INT,
    video_views INT,
    impressions INT,
    reach INT,
    engagement INT,              -- likes + comments + saves
    engagement_rate FLOAT,       -- engagement / reach
    CONSTRAINT fk_silver_post
        FOREIGN KEY (post_id) REFERENCES bronze.raw_instagram_posts(post_id)
);
GO

-- Aggregated performance by media type
CREATE TABLE silver.media_type_performance (
    ig_account_id INT,
    media_type NVARCHAR(50),
    avg_engagement FLOAT,
    avg_engagement_rate FLOAT,
    sample_size INT,
    PRIMARY KEY (ig_account_id, media_type)
);
GO

-- Aggregated performance by posting hour
CREATE TABLE silver.posting_time_performance (
    ig_account_id INT,
    posting_hour INT,
    avg_engagement FLOAT,
    sample_size INT,
    PRIMARY KEY (ig_account_id, posting_hour)
);
GO

