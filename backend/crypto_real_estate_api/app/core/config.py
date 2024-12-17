from pydantic_settings import BaseSettings
import os
from pathlib import Path

class Settings(BaseSettings):
    # Base directory of the project
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent

    # Database
    DB_USER: str = os.getenv("DB_USER", "crypto_estate_user")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "your_password_here")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_NAME: str = os.getenv("DB_NAME", "crypto_estate")
    DATABASE_URL: str = f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

settings = Settings()
