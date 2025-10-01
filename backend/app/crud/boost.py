from sqlalchemy.orm import Session
from sqlalchemy import select, union
from typing import List, Optional
from app import models
from app.schemas.Boost import *

def get_boost_by_origin(db: Session, bo_origin: int) -> List[models.Boost]:
    return db.query(models.Boost).filter(models.Boost.bo_origin == bo_origin).all()

def get_all_boosts(db: Session)-> List[models.Boost]:
    return db.query(models.Boost).all()

def get_boosts_by_caballero(db:Session, ca_key) -> List[models.Boost]:
    # Se obtienen los boost por signo
    boost_signo = select(models.Boost).select_from(models.Caballero).join(
        models.Boost, models.Caballero.ca_zo_key == models.Boost.bo_origin
    ).where(
        models.Boost.bo_type == "Signo",
        models.Caballero.ca_key == ca_key
    )

    # Segundo select (Deidad)
    boost_deidad = select(models.Boost).select_from(models.Caballero).join(
        models.Boost, models.Caballero.ca_di_key == models.Boost.bo_origin
    ).where(
        models.Boost.bo_type == "Deidad",
        models.Caballero.ca_key == ca_key
    )

    # UNION
    stmt_union = union(boost_signo, boost_deidad)

    # Ejecutar
    return db.execute(stmt_union).all()
 