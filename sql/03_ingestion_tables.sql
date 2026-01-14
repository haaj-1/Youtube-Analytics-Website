-- Ingestion Tables
-- =============================================
CREATE TABLE ingestion.instagram_accounts (
    ig_account_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES auth.users(user_id),
    instagram_user_id NVARCHAR(50) NOT NULL,
    username NVARCHAR(255) NOT NULL,
    account_type NVARCHAR(50), -- business / creator
    connected_at DATETIME2 DEFAULT GETDATE(),
    access_token_encrypted NVARCHAR(MAX),
    token_expires_at DATETIME2
);
GO

CREATE TABLE ingestion.raw_instagram_posts (
    post_id INT IDENTITY(1,1) PRIMARY KEY,
    ig_account_id INT NOT NULL FOREIGN KEY REFERENCES ingestion.instagram_accounts(ig_account_id),
    instagram_media_id NVARCHAR(50) NOT NULL,
    caption NVARCHAR(MAX),
    media_type NVARCHAR(50),
    posted_at DATETIME2,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    impressions INT DEFAULT 0,
    reach INT DEFAULT 0,
    saved INT DEFAULT 0,
    video_views INT DEFAULT 0,   -- for videos/Reels
    pulled_at DATETIME2 DEFAULT GETDATE()
);
GO

CREATE TABLE ingestion.post_metrics (
    metric_id INT IDENTITY(1,1) PRIMARY KEY,
    post_id INT NOT NULL FOREIGN KEY REFERENCES ingestion.raw_instagram_posts(post_id),
    impressions INT DEFAULT 0,
    reach INT DEFAULT 0,
    saved INT DEFAULT 0,
    video_views INT DEFAULT 0,
    recorded_at DATETIME2 DEFAULT GETDATE()
);
GO
