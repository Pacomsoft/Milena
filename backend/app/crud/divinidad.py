from sqlalchemy.orm import Session
from typing import List, Optional
from app import models
from app.schemas.Divinidad import *

def get_deidades_activas(db:Session):
    return db.query(models.Divinidad).filter(models.Divinidad.di_status==1).all()

def get_deidad(db:Session, id:int):
    return db.query(models.Divinidad).filter(models.Divinidad.di_key==id).first()
