from sqlalchemy.orm import Session
from app import models
from app.schemas.Zodiaco import *

def get_signos_zodiacales(db:Session):
    return db.query(models.Zodiaco).all()

def get_signo_zodiacal(db:Session, id:int):
    return db.query(models.Zodiaco).filter(models.Zodiaco.zo_key==id).first()