import os
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev_secret")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

settings = Settings()
