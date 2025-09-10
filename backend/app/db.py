# backend/app/db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# 🔹 Base declarativa
Base = declarative_base()

# 🔹 URL de la DB
DB_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@db:3306/SSRPG")

# 🔹 Engine
engine = create_engine(DB_URL, pool_pre_ping=True)

# 🔹 Sesión
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🔹 Dependencia para obtener sesión de DB
def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()