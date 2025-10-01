from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas import Habilidades as HabilidadesSchema
from app.db import get_db
from app.operations.entrenar import calcular_costo_stat
router = APIRouter()

@router.post("/GET_Costo")
def get_divinidades(req: HabilidadesSchema.NivelStat):
    costo = calcular_costo_stat(req.nivel_stat)
    return {'costo':costo}
