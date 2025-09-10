from pydantic import BaseSettings, ValidationError

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