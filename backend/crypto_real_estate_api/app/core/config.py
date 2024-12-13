from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Crypto Real Estate API"
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    FRONTEND_URL: str = "http://localhost:5173"

    # Storage configuration
    STORAGE_TYPE: str = "local"  # Options: "s3" or "local"
    UPLOAD_DIR: str = "uploads"  # Local storage directory

    # AWS S3 Configuration (optional)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_BUCKET_NAME: Optional[str] = None
    AWS_REGION: str = "us-east-1"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
