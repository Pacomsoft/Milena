from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.crud import caballero as CaballeroCRUD
from app.schemas import Caballero as CaballeroSchema
from app.db import get_db

router = APIRouter()


@router.get("/mis_caballeros/{account_id}", response_model=Optional[CaballeroSchema.CaballeroOut])
def get_caballero(account_id: int, db: Session = Depends(get_db)):
    caballeros = CaballeroCRUD.get_caballeros_by_account(db, account_id)
    
    if not caballeros:
        return None  # no hay caballero, devuelve null

    # si quieres devolver solo el primero
    return caballeros[0]




