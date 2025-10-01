from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.api_v1.auth import get_current_user
from typing import List, Optional
from app.crud import caballero as CaballeroCRUD
from app.schemas import Caballero as CaballeroSchema
from app.db import get_db
from datetime import datetime
from app.operations.entrenar import *

router = APIRouter()


@router.get("/mis_caballeros/{account_id}", response_model=Optional[CaballeroSchema.CaballeroOut])
def get_caballero(account_id: int, db: Session = Depends(get_db), current_user:dict=Depends(get_current_user)):
    caballeros = CaballeroCRUD.get_caballeros_by_account(db, account_id)
    
    if not caballeros:
        return None  # no hay caballero, devuelve null

    # si quieres devolver solo el primero
    return caballeros[0]

@router.post("/newplayer", response_model=CaballeroSchema.CaballeroOut)
def create_caballero(
    cab_data: CaballeroSchema.CaballeroCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # 🔒 autenticación
):
    # Validar que el nombre no exista
    existing = CaballeroCRUD.get_caballero_by_username(db, username=cab_data.ca_name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="¡El nombre del caballero ya existe! Ingresa otro."
        )

    # Forzar que el caballero pertenezca al usuario autenticado
    cab_data.ca_ac_key = current_user["cuenta"]

    # Crear el caballero
    new_caballero = CaballeroCRUD.new_caballero(db, cab_data)
    if not new_caballero:
        raise HTTPException(status_code=400, detail="No se pudo crear el caballero")

    return CaballeroSchema.CaballeroOut.from_orm(new_caballero)

@router.post("/addStat", response_model=CaballeroSchema.CaballeroOut)
def increment_stat(increment_data : CaballeroSchema.CaballeroUpdateStat, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    print("Incrementando stat:", increment_data.stat)
    mapStats ={
        "reflejos":"ca_agility",
        "sabiduria":"ca_knowledge",
        "cosmo":"ca_cosmo",
        "persistencia":"ca_persistence",
        "fuerza":"ca_power",
        "presicion":"ca_precision",
        "resistencia":"ca_resistance",
        "resistenciap":"ca_psy_resistance",
        "septimo":"ca_seventh_sense",
        "velocidad":"ca_velocity"
    }
    stat = mapStats.get(increment_data.stat)

    #Se validad que el caballero cuente con Puntos de habiliad y Oro suficiente para incrementar el stat
    prepare = CaballeroCRUD.prepare_upgrade_stat(db, increment_data.ca_key, stat)
    habilidad_actual = prepare['habilidad'] #Puntos de habilidad actual al momento de querer actualizar el stat
    oro_actual = prepare['oro'] #Oro actual al momento de querer actualizar el stat.
    nivel_actual = prepare['nivel'] #Nivel actual del stat iterado para
    costo = calcular_costo_stat(nivel_actual) #Se obtiene el costo para subir el stat según su nivel

    #Si el costo es mayor al oro, no se sube
    if(costo> oro_actual):
        raise HTTPException(status_code=400, detail="No se cuenta con el oro suficiente para actualizar la habilidad.")
    
    else:
        #Si no tiene puntos de habilidad a asignar, no se sube
        if(habilidad_actual <=0):
            raise HTTPException(status_code=400, detail="No se cuenta con puntos de habilidad para asignar al caballero.")
        else:            
            #Se realiza el update, enviando el stat a modificar y el costo para ser descontado de su oro.
            add_stat = CaballeroCRUD.update_stat(db, increment_data.ca_key, stat,  costo=costo)
    
    return add_stat


