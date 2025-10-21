import select
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models
from app.schemas.Caballero import *
from datetime import datetime
from sqlalchemy.sql import func

def get_caballeros_by_account(db: Session, account_id: int) -> List[models.Caballero]:
    return db.query(models.Caballero).filter(models.Caballero.ca_ac_key == account_id).all()

def get_contrincantes(
        db: Session,
        nombre: Optional[str] = None,
        nivel: Optional[int] = None,
        signo: Optional[str] = None,
        deidad: Optional[str] = None,
        zona: int = 1,
        account: int = 0,
        nivel_act: int = 0
    ) -> List[dict]:
    query = (
            db.query(
                models.Caballero.ca_key.label("id"),
                models.Caballero.ca_name.label("nombre"),
                models.Caballero.ca_level.label("nivel"),
                models.Caballero.ca_experience.label("experiencia"),
                models.Caballero.ca_knowledge.label("conocimiento"),
                models.Caballero.ca_health.label("salud"),
                models.Caballero.ca_cosmo.label("cosmo"),
                models.Caballero.ca_power.label("poder"),
                models.Caballero.ca_resistance.label("resistencia"),
                models.Caballero.ca_velocity.label("velocidad"),
                models.Caballero.ca_precision.label("precision"),
                models.Caballero.ca_agility.label("agilidad"),
                models.Caballero.ca_psy_resistance.label("resistencia_mental"),
                models.Caballero.ca_persistence.label("persistencia"),
                models.Caballero.ca_seventh_sense.label("septimo_sentido"),
                models.Zodiaco.zo_name.label("signo_name"),
                models.Divinidad.di_name.label("divinidad_name"),
                models.Caballero.ca_img_main.lavbel("imagen_principal")
            )
            .join(models.Zodiaco, models.Caballero.ca_zo_key == models.Zodiaco.zo_key)
            .join(models.Divinidad, models.Caballero.ca_di_key == models.Divinidad.di_key)
    )

    query = (
        query
        .filter(models.Caballero.ca_status_player == 1)  # por ejemplo, activo
        .filter((models.Caballero.ca_health_act * 100) / models.Caballero.ca_health > 20)  # más del 20% de vida
        .filter(models.Caballero.ca_zon_key_act == zona)  # misma zona
        .filter(models.Caballero.ca_ac_key != account)    # no el mismo usuario
    )

    # ===== Filtros opcionales =====
    if nombre:
        query = query.filter(models.Caballero.ca_name.ilike(f"%{nombre}%"))
    if nivel:
        query = query.filter(models.Caballero.ca_level == nivel)
    else:
        query = query.filter(models.Caballero.ca_level == nivel_act)
    if signo:
        query = query.filter(models.Zodiaco.zo_name.ilike(f"%{signo}%"))
    if deidad:
        query = query.filter(models.Divinidad.di_name.ilike(f"%{deidad}%"))
    
    query = query.order_by(func.random()).limit(1)
    result = query.first()
        # Ejecutar consulta

        # Convertir en lista de dicts (para que sea compatible con .mappings())
    return [result]

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

