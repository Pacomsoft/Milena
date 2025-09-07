from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
import time

from .db import SessionLocal, engine

app = FastAPI(title="SeiyaRPG - Backend (dev)")

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

# ejemplo de endpoint que usa DB session
def get_db():
    retries = 5
    for i in range(retries):
        try:
            db = SessionLocal()
            yield db
            db.close()
            break
        except OperationalError:
            if i < retries - 1:
                time.sleep(2)
            else:
                raise

@app.get("/api/hello")
def hello():
    return {"message": "Hola desde FastAPI 👋"}
