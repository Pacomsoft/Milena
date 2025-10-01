from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.crud import boost as BoostCRUD
from app.schemas import Boost as BoostSchema
from app.db import get_db
from app.api.api_v1.Account import get_current_user

router = APIRouter()


@router.get("/boost_origen/{bo_origin}", response_model=Optional[BoostSchema.BoostOut])
def get_caballero(bo_origin: int, db: Session = Depends(get_db)):
    boosts = BoostCRUD.get_boost_by_origin(db, bo_origin)
    
    if not boosts:
        return None  # no hay caballero, devuelve null

    # si quieres devolver solo el primero
    return boosts[0]

@router.post("/all_boosts", response_model=List[BoostSchema.BoostOut])
def get_all_boosts(db: Session = Depends(get_db)):
    boosts = BoostCRUD.get_all_boosts(db)

    if not boosts:
        return None
    
    return boosts

@router.get("/boost_caballero/{id}", response_model=List[BoostSchema.BoostOut])
def get_boost_by_caballero(id:int, db:Session = Depends(get_db), current_user:dict = Depends(get_current_user)):
    boosts = BoostCRUD.get_boosts_by_caballero(db, id)
    return boosts

