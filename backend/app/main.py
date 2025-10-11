from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import time

from app.db import *
from app.models.Account import Account
from app.api.api_v1.api import api_router


# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SeiyaRPG - Backend (dev)")
#app.include_router(auth_router)
app.include_router(api_router, prefix="/api/v1")

# CORS: en dev permitir localhost:3000 (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.0.17:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



