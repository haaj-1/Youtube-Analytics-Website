from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "mssql+pyodbc://localhost/prepost_analytics?driver=ODBC+Driver+17+for+SQL+Server"
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # YouTube API
    YOUTUBE_API_KEY: Optional[str] = None
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    
    # ML Models
    MODEL_PATH: str = "./models"
    
    class Config:
        env_file = ".env"

settings = Settings()