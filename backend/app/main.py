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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# simple health endpoint
@app.get("/api/health")
def health():
    return {"status": "ok"}


# 🔹 Listar usuarios
@app.get("/api/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(Account).all()
    return [{"id": u.ac_key, "username": u.ac_username} for u in users]

@app.get("/api/hello")
def hello():
    return {"message": "Hola desde FastAPI 👋"}
