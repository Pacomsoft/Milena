from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.crud import divinidad as DivinidadCRUD
from app.schemas import Divinidad as DivinidadSchema
from app.db import get_db

router = APIRouter()

@router.post("/GET_Divinidades", response_model=List[DivinidadSchema.DivinidadOut])
def get_divinidades(db: Session = Depends(get_db)):
    divinidades = DivinidadCRUD.get_deidades_activas(db)
    
    if not divinidades:
        return None  # no hay caballero, devuelve null

    # si quieres devolver solo el primero
    return divinidades