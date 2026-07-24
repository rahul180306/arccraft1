from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """
    Centralized configuration using Pydantic Settings.
    """
    # App Info
    APP_NAME: str = "ArcCraft AI Investigation OS"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    # Database
    DATABASE_URL: str

    # AI & Models
    NVIDIA_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GLM_MODEL: str = "nvidia/glm-5.2"
    EMBEDDING_MODEL: str = "nvidia/nemotron-3-embed-1b"

    # LLM Gateway Configuration
    DEFAULT_PROVIDER: str = "nvidia"
    DEFAULT_REASONING_MODEL: str = "nvidia/glm-5.2"
    DEFAULT_EMBEDDING_MODEL: str = "nvidia/nemotron-3-embed-1b"
    FALLBACK_PROVIDER: str = "gemini"
    FALLBACK_MODEL: str = "gemini-3.1-pro-preview"
    ENABLE_PROVIDER_FALLBACK: bool = True
    ENABLE_STREAMING: bool = True
    ENABLE_IMAGE_MODELS: bool = True
    ENABLE_AUDIO_MODELS: bool = True

    # Security
    JWT_SECRET: str = "CHANGE_THIS_IN_PRODUCTION"

    # Infrastructure
    REDIS_URL: Optional[str] = None
    CHROMA_PATH: str = "./chroma_db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
