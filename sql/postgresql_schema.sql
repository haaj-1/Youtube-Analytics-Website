-- PostgreSQL Schema for PrePost Analytics
-- Run this on your PostgreSQL database (Render/Railway will auto-create database)

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS ml;
CREATE SCHEMA IF NOT EXISTS audit;

-- Users table
CREATE TABLE IF NOT EXISTS auth.users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password_hash VARCHAR(255),
    auth_provider VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON auth.users(email);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_refresh_tokens_user ON auth.refresh_tokens(user_id);

-- Predictions
CREATE TABLE IF NOT EXISTS ml.predictions (
    prediction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES auth.users(user_id) ON DELETE CASCADE,
    video_id VARCHAR(50),
    thumbnail_url VARCHAR(500),
    title VARCHAR(500),
    description TEXT,
    category_id VARCHAR(10),
    subscriber_range VARCHAR(50),
    predicted_views BIGINT,
    predicted_engagement_rate FLOAT,
    predicted_ctr FLOAT,
    confidence_score FLOAT,
    recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_predictions_user ON ml.predictions(user_id);
CREATE INDEX idx_predictions_created ON ml.predictions(created_at);

-- Videos dataset
CREATE TABLE IF NOT EXISTS ml.videos_dataset (
    video_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500),
    description TEXT,
    thumbnail_url VARCHAR(500),
    category_id VARCHAR(10),
    subscriber_range VARCHAR(50),
    views BIGINT,
    likes INTEGER,
    comments INTEGER,
    engagement_rate FLOAT,
    ctr FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Model metadata
CREATE TABLE IF NOT EXISTS ml.model_metadata (
    model_id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    accuracy_score FLOAT,
    training_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    model_path VARCHAR(255),
    metadata_json TEXT
);

-- API request logs
CREATE TABLE IF NOT EXISTS audit.api_request_logs (
    request_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    endpoint VARCHAR(100),
    status_code INTEGER,
    request_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_logs_user ON audit.api_request_logs(user_id);
CREATE INDEX idx_api_logs_time ON audit.api_request_logs(request_time);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit.audit_logs (
    audit_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action_type VARCHAR(50),
    action_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit.audit_logs(created_at);
