from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import Estados, HistorialEstado


def check_active_status(db:Session, ca_key: int, nombre_estado: str):
    return db.query(HistorialEstado).join(Estados).filter(
        HistorialEstado.hi_ca_key == ca_key,
        HistorialEstado.hi_active,
        Estados.es_name == nombre_estado
    ).first() is not None