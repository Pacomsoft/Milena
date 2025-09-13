from sqlalchemy.orm import Session
from app import models
from app.schemas.Zodiaco import *

def get_signos_zodiacales(db:Session):
    return db.query(models.Zodiaco).all()