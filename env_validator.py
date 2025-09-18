try:
    from pydantic_settings import BaseSettings  # Pydantic v2
except ImportError:
    from pydantic import BaseSettings as LegacyBaseSettings  # fallback for Pydantic v1

    BaseSettings = LegacyBaseSettings

from pydantic import ValidationError


class Settings(BaseSettings):
    OPENAI_API_KEY: str
    QDRANT_URL: str
    QDRANT_API_KEY: str


try:
    Settings()
    print("✅ Environment variables validated successfully")
except ValidationError as e:
    print("❌ Environment validation failed:")
    print(e)
    exit(1)
