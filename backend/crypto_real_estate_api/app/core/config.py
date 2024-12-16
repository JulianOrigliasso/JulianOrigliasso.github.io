from pydantic_settings import BaseSettings
import os
from pathlib import Path

class Settings(BaseSettings):
    # Base directory of the project
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent

    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/crypto_real_estate.db"

    # JWT
    SECRET_KEY: str = "your-secret-key-here"  # In production, this should be in environment variables
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

settings = Settings()
