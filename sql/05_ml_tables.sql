-- ML Tables
CREATE TABLE ml.caption_embeddings (
    embedding_id INT IDENTITY(1,1) PRIMARY KEY,
    post_id INT NOT NULL FOREIGN KEY REFERENCES ingestion.raw_instagram_posts(post_id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES auth.users(user_id),
    model_version NVARCHAR(50) NOT NULL, -- e.g., 'bert-base-uncased'
    embedding VARBINARY(MAX) NOT NULL,    -- serialized BERT vector
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

CREATE TABLE ml.predictions (
    prediction_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES auth.users(user_id),
    post_id INT NULL FOREIGN KEY REFERENCES ingestion.raw_instagram_posts(post_id), -- optional pre-post
    predicted_likes INT,
    predicted_comments INT,
    predicted_saves INT,
    predicted_video_views INT,
    predicted_engagement FLOAT,
    engagement_rate FLOAT,
    confidence_lower FLOAT,
    confidence_upper FLOAT,
    model_version NVARCHAR(50),
    created_at DATETIME2 DEFAULT GETDATE()
);
GO
