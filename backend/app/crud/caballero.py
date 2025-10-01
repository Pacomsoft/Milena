from sqlalchemy.orm import Session
from typing import List, Optional
from app import models
from app.schemas.Caballero import *
from datetime import datetime

def get_caballeros_by_account(db: Session, account_id: int) -> List[models.Caballero]:
    return db.query(models.Caballero).filter(models.Caballero.ca_ac_key == account_id).all()

def create_caballero(db: Session, cab_data):
    # Construimos el diccionario con todos los campos posibles
    data = {
            "ca_name": cab_data.ca_name,
            "ca_ac_key": cab_data.ca_ac_key,
            "ca_di_key": cab_data.ca_di_key,
            "ca_zo_key": cab_data.ca_zo_key,
            "ca_createdate": datetime.utcnow(),
            "ca_status_player": True
     }

        # Sobrescribimos con cualquier campo extra que venga del form
    optional_fields = [
            "ca_level", "ca_experience", "ca_gold", "ca_hability", "ca_health",
            "ca_health_act", "ca_velocity", "ca_power", "ca_knowledge",
            "ca_precision", "ca_agility", "ca_resistance", "ca_psy_resistance",
            "ca_persistence", "ca_cosmo", "ca_cosmo_act", "ca_seventh_sense",
            "ca_seventh_sense_act", "ca_honor", "ca_win", "ca_loss",
            "ca_zon_key_act", "ca_status", "ca_comments"
    ]

    for field in optional_fields:
            if hasattr(cab_data, field) and getattr(cab_data, field) is not None:
                data[field] = getattr(cab_data, field)

        # Creamos el objeto ORM
    new_caballero = models.Caballero(**data)
    db.add(new_caballero)
    db.commit()
    db.refresh(new_caballero)
    return new_caballero

def new_caballero(db: Session, caballero_in: CaballeroCreate) -> models.Caballero:    
    db_caballero = models.Caballero(
        ca_ac_key=caballero_in.ca_ac_key,
        ca_name=caballero_in.ca_name,
        ca_velocity=caballero_in.ca_velocity,
        ca_power=caballero_in.ca_power,
        ca_knowledge=caballero_in.ca_knowledge,
        ca_precision=caballero_in.ca_precision,
        ca_agility=caballero_in.ca_agility,
        ca_resistance=caballero_in.ca_resistance,
        ca_psy_resistance=caballero_in.ca_psy_resistance,
        ca_persistence=caballero_in.ca_persistence,
        ca_cosmo=caballero_in.ca_cosmo,
        ca_seventh_sense=caballero_in.ca_seventh_sense,
        ca_di_key=caballero_in.ca_di_key,
        ca_zo_key=caballero_in.ca_zo_key,        
        # Campos que tu ResponseModel requiere
        ca_status_player=True,  # jugando
        ca_createdate=datetime.utcnow(),  # fecha de creación
        ca_zon_key_act=1,  # zona actual default
        ca_status="Ready",  # estado inicial
    )
    
    db.add(db_caballero)
    db.commit()
    db.refresh(db_caballero)
    cab = db.query(models.Caballero).first()
    print(cab.ca_name, cab.ca_di_key, cab.ca_zo_key, cab.ca_key, cab.ca_ac_key, cab.ca_createdate, cab.ca_status_player)

    return db_caballero


def prepare_upgrade_stat(db: Session, caballero: int, stat: str):
    try:
        registro = (
            db.query(models.Caballero)
            .filter(models.Caballero.ca_key == caballero)
            .first()
        )

        print("stat", stat)
        response = {
        "oro": registro.ca_gold,
        "habilidad": registro.ca_hability,
        "nivel": getattr(registro, stat, None)
        }
    except Exception as e:
        db.rollback()
        raise e
    if not registro:
            return None

    return response


def update_stat(db: Session, caballero: int, stat: str, costo: int) -> CaballeroOut:
    try:
        registro = db.query(models.Caballero).filter(models.Caballero.ca_key == caballero).first()
        if not registro:
            return None  # o lanzar excepción si quieres

        # Restar costo y 1 punto de habilidad
        registro.ca_gold -= costo
        registro.ca_hability -= 1

        # Incrementar el stat dinámicamente
        valor_actual = getattr(registro, stat, 0)
        setattr(registro, stat, valor_actual + 1)

        db.commit()
        db.refresh(registro)
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

    return CaballeroOut.from_orm(registro)


def get_caballero_by_username(db: Session, username: str) -> Optional[models.Caballero]:
    return db.query(models.Caballero).filter(models.Caballero.ca_name == username).first()

