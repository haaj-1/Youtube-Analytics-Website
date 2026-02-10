USE prepost_analytics;
GO

/*****************************************************************************************
SECTION 5 — ANALYTICS VIEWS & PROCEDURES (ml)
------------------------------------------------------------------------------------------
Purpose:
- Provide analytical views for performance insights
- DELETE Unknown FROM category_name IN the ml.videos_dataset tablewindow functions, CTEs, aggregations
- Stored procedures for complex queries and data operations
- Support benchmarking and trend analysis
*****************************************************************************************/

-- ============================================================================
-- ANALYTICAL VIEWS - Showcase SQL aggregation, window functions, CTEs
-- ============================================================================

-- Video performance metrics by category
CREATE OR ALTER VIEW ml.vw_category_performance AS
WITH category_stats AS (
    SELECT 
        category_name,
        view_count,
        engagement_rate,
        duration_seconds
    FROM ml.videos_dataset
)
SELECT 
    category_name,
    COUNT(*) as total_videos,
    AVG(view_count) as avg_views,
    AVG(engagement_rate) as avg_engagement,
    AVG(duration_seconds) as avg_duration,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY view_count) OVER (PARTITION BY category_name) as median_views,
    MAX(view_count) as max_views,
    MIN(view_count) as min_views
FROM category_stats
GROUP BY category_name, view_count;
GO

-- Channel performance by subscriber range
CREATE OR ALTER VIEW ml.vw_subscriber_range_performance AS
SELECT 
    subscriber_range,
    COUNT(*) as video_count,
    AVG(view_count) as avg_views,
    AVG(like_count) as avg_likes,
    AVG(comment_count) as avg_comments,
    AVG(engagement_rate) as avg_engagement,
    STDEV(view_count) as view_count_stddev
FROM ml.videos_dataset
WHERE subscriber_count IS NOT NULL
GROUP BY subscriber_range;
GO

-- Top performing videos with ranking
CREATE OR ALTER VIEW ml.vw_top_videos_ranked AS
WITH ranked_videos AS (
    SELECT 
        video_id,
        title,
        channel_title,
        category_name,
        view_count,
        engagement_rate,
        ROW_NUMBER() OVER (PARTITION BY category_name ORDER BY view_count DESC) as rank_in_category,
        NTILE(10) OVER (ORDER BY view_count) as performance_decile
    FROM ml.videos_dataset
)
SELECT * FROM ranked_videos WHERE rank_in_category <= 10;
GO

-- Video duration analysis
CREATE OR ALTER VIEW ml.vw_duration_analysis AS
SELECT 
    CASE 
        WHEN duration_seconds < 60 THEN 'Shorts (<1min)'
        WHEN duration_seconds < 300 THEN 'Short (1-5min)'
        WHEN duration_seconds < 600 THEN 'Medium (5-10min)'
        WHEN duration_seconds < 1200 THEN 'Long (10-20min)'
        ELSE 'Very Long (>20min)'
    END as duration_category,
    COUNT(*) as video_count,
    AVG(view_count) as avg_views,
    AVG(engagement_rate) as avg_engagement
FROM ml.videos_dataset
GROUP BY 
    CASE 
        WHEN duration_seconds < 60 THEN 'Shorts (<1min)'
        WHEN duration_seconds < 300 THEN 'Short (1-5min)'
        WHEN duration_seconds < 600 THEN 'Medium (5-10min)'
        WHEN duration_seconds < 1200 THEN 'Long (10-20min)'
        ELSE 'Very Long (>20min)'
    END;
GO

-- ============================================================================
-- STORED PROCEDURES - Showcase complex queries, transactions, error handling
-- ============================================================================

-- Get video recommendations based on similar performance
CREATE OR ALTER PROCEDURE ml.sp_get_similar_videos
    @video_id VARCHAR(50),
    @top_n INT = 5
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @category VARCHAR(100);
    DECLARE @subscriber_range VARCHAR(50);
    DECLARE @target_views BIGINT;
    
    -- Get target video metrics
    SELECT 
        @category = category_name,
        @subscriber_range = subscriber_range,
        @target_views = view_count
    FROM ml.videos_dataset
    WHERE video_id = @video_id;
    
    -- Find similar videos
    SELECT TOP (@top_n)
        video_id,
        title,
        channel_title,
        view_count,
        engagement_rate,
        ABS(view_count - @target_views) as view_difference
    FROM ml.videos_dataset
    WHERE category_name = @category
        AND subscriber_range = @subscriber_range
        AND video_id != @video_id
    ORDER BY ABS(view_count - @target_views);
END;
GO

-- Calculate performance benchmarks
CREATE OR ALTER PROCEDURE ml.sp_calculate_benchmarks
    @category_id VARCHAR(10),
    @subscriber_range VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(*) as sample_size,
        AVG(view_count) as avg_views,
        STDEV(view_count) as stddev_views,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY view_count) OVER () as p25_views,
        PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY view_count) OVER () as p50_views,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY view_count) OVER () as p75_views,
        AVG(engagement_rate) as avg_engagement,
        AVG(like_count * 1.0 / NULLIF(view_count, 0)) as avg_like_rate,
        AVG(comment_count * 1.0 / NULLIF(view_count, 0)) as avg_comment_rate
    FROM ml.videos_dataset
    WHERE category_id = @category_id
        AND subscriber_range = @subscriber_range
    GROUP BY category_id, subscriber_range;
END;
GO

-- Batch insert videos with error handling
CREATE OR ALTER PROCEDURE ml.sp_batch_insert_videos
    @videos NVARCHAR(MAX) -- JSON array
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO ml.videos_dataset (
            video_id, title, description, channel_id, channel_title,
            category_id, category_name, published_at, thumbnail_url,
            duration_seconds, view_count, like_count, comment_count,
            engagement_rate, subscriber_count, subscriber_range, tags
        )
        SELECT 
            video_id, title, description, channel_id, channel_title,
            category_id, category_name, published_at, thumbnail_url,
            duration_seconds, view_count, like_count, comment_count,
            engagement_rate, subscriber_count, subscriber_range, tags
        FROM OPENJSON(@videos)
        WITH (
            video_id VARCHAR(50),
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
            tags NVARCHAR(MAX)
        );
        
        COMMIT TRANSACTION;
        SELECT 'Success' as status, @@ROWCOUNT as rows_inserted;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SELECT 
            'Error' as status,
            ERROR_MESSAGE() as error_message,
            ERROR_NUMBER() as error_number;
    END CATCH;
END;
GO

-- Get trending patterns
CREATE OR ALTER PROCEDURE ml.sp_get_trending_patterns
    @days_back INT = 30
AS
BEGIN
    SET NOCOUNT ON;
    
    WITH daily_stats AS (
        SELECT 
            CAST(collected_at AS DATE) as collection_date,
            category_name,
            COUNT(*) as videos_collected,
            AVG(view_count) as avg_views,
            AVG(engagement_rate) as avg_engagement
        FROM ml.videos_dataset
        WHERE collected_at >= DATEADD(DAY, -@days_back, GETUTCDATE())
        GROUP BY CAST(collected_at AS DATE), category_name
    )
    SELECT 
        collection_date,
        category_name,
        videos_collected,
        avg_views,
        avg_engagement,
        LAG(avg_views) OVER (PARTITION BY category_name ORDER BY collection_date) as prev_avg_views,
        (avg_views - LAG(avg_views) OVER (PARTITION BY category_name ORDER BY collection_date)) / 
            NULLIF(LAG(avg_views) OVER (PARTITION BY category_name ORDER BY collection_date), 0) * 100 as view_growth_pct
    FROM daily_stats
    ORDER BY collection_date DESC, category_name;
END;
GO
