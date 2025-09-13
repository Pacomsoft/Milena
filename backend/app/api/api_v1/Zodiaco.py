from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.crud import zodiaco as ZodiacoCRUD
from app.schemas import Zodiaco as ZodiacoSchema
from app.db import get_db

router = APIRouter()

@router.post("/GET_Signos", response_model=List[ZodiacoSchema.ZodiacoOutput])
def get_signos(db: Session = Depends(get_db)):
    signos = ZodiacoCRUD.get_signos_zodiacales(db)
    
    if not signos:
        return None  # no hay caballero, devuelve null

    # si quieres devolver solo el primero
    return signos