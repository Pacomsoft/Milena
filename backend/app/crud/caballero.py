from sqlalchemy.orm import Session
from typing import List, Optional
from app import models
from app.schemas.Caballero import *

def get_caballeros_by_account(db: Session, account_id: int) -> List[models.Caballero]:
    return db.query(models.Caballero).filter(models.Caballero.ca_ac_key == account_id).all()