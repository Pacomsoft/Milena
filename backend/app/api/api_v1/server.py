# routers/health.py
from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from app.db import get_db  # tu motor SQLAlchemy
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/ping")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  # <- aquí solo ejecutas directamente
        return {"status": "ok", "db": "connected"}
    except SQLAlchemyError as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "error", "db": "disconnected", "error": str(e)}
        )