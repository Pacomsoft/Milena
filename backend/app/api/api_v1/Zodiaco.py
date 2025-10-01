from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
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

@router.get("/GET_Signo/{id}", response_model=Optional[ZodiacoSchema.ZodiacoOutput])
def get_signo(id:int, db: Session = Depends(get_db)):
    signo = ZodiacoCRUD.get_signo_zodiacal(db, id)
    
    if not signo:
        return None  # no hay caballero, devuelve null

    # si quieres devolver solo el primero
    return signo