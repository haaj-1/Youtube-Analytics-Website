/*****************************************************************************************
SECTION 3 — BRONZE LAYER (RAW INGESTION)
------------------------------------------------------------------------------------------
Purpose:
- Store raw Instagram Graph API responses
- Append-only, immutable
- No transformations or business logic
- Acts as the system of record
*****************************************************************************************/

-- Maps application users to their Instagram accounts
CREATE TABLE bronze.instagram_accounts (
    ig_account_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    instagram_user_id NVARCHAR(100) NOT NULL,
    username NVARCHAR(255),
    account_type NVARCHAR(50), -- business / creator
    access_token_encrypted VARBINARY(MAX),
    token_expires_at DATETIME2,
    connected_at DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT fk_instagram_accounts_user
        FOREIGN KEY (user_id) REFERENCES auth.users(user_id)
);
GO

-- Raw Instagram post data (mirrors API structure)
CREATE TABLE bronze.raw_instagram_posts (
    post_id INT IDENTITY(1,1) PRIMARY KEY,
    ig_account_id INT NOT NULL,
    instagram_media_id NVARCHAR(100) NOT NULL,
    caption NVARCHAR(MAX),
    media_type NVARCHAR(50), -- image / video / reel / carousel
    posted_at DATETIME2 NOT NULL,
    like_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    saved INT DEFAULT 0,
    video_views INT DEFAULT 0,
    pulled_at DATETIME2 DEFAULT SYSDATETIME(),
    CONSTRAINT fk_raw_posts_account
        FOREIGN KEY (ig_account_id) REFERENCES bronze.instagram_accounts(ig_account_id)
);
GO

-- Daily performance metrics (time-series)
CREATE TABLE bronze.post_metrics_daily (
    metric_id INT IDENTITY(1,1) PRIMARY KEY,
    post_id INT NOT NULL,
    impressions INT DEFAULT 0,
    reach INT DEFAULT 0,
    recorded_at DATETIME2 NOT NULL,
    CONSTRAINT fk_metrics_post
        FOREIGN KEY (post_id) REFERENCES bronze.raw_instagram_posts(post_id)
);
GO

