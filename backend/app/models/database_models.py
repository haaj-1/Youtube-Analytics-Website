from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger, Float, Text
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'schema': 'auth'}
    
    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255))
    password_hash = Column(String(255))
    auth_provider = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login_at = Column(DateTime(timezone=True))

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    __table_args__ = {'schema': 'auth'}
    
    token_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('auth.users.user_id'), nullable=False)
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    revoked_at = Column(DateTime(timezone=True))

class Prediction(Base):
    __tablename__ = "predictions"
    __table_args__ = {'schema': 'ml'}
    
    prediction_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('auth.users.user_id'), nullable=False)
    video_id = Column(String(50))
    thumbnail_url = Column(String(500))
    title = Column(String(500))
    description = Column(Text)
    category_id = Column(String(10))
    subscriber_range = Column(String(50))
    predicted_views = Column(BigInteger)
    predicted_engagement_rate = Column(Float)
    predicted_ctr = Column(Float)
    confidence_score = Column(Float)
    recommendations = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class APIRequestLog(Base):
    __tablename__ = "api_request_logs"
    __table_args__ = {'schema': 'audit'}
    
    request_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    endpoint = Column(String(100))
    status_code = Column(Integer)
    request_time = Column(DateTime(timezone=True), server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {'schema': 'audit'}
    
    audit_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    action_type = Column(String(50))
    action_details = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())