import select
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app import models
from app.schemas.Caballero import *
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy import text

# def get_caballeros_by_account(db: Session, account_id: int) -> List[models.Caballero]:
#     return db.query(models.Caballero).filter(models.Caballero.ca_ac_key == account_id).all()

def get_caballeros_by_account(db: Session, account_id: int) -> List[models.Caballero]:
    cab = db.query(models.Caballero)\
        .options(joinedload(models.Caballero.divinidad))\
        .first()
    print(cab.divinidad)
    return (
        db.query(models.Caballero)
        .options(
            joinedload(models.Caballero.divinidad),
            joinedload(models.Caballero.signo),
            joinedload(models.Caballero.zona),
        )
        .filter(models.Caballero.ca_ac_key == account_id)
        .all()
    )

# def get_caballeros_by_account(db: Session, account_id: int) -> List[CaballeroOut]:
#     query = (
#         db.query(
#             models.Caballero.ca_key.label("id"),
#             models.Caballero.ca_ac_key.label("id_avatar"),
#             models.Caballero.ca_name.label("nombre"),
#             models.Caballero.ca_level.label("nivel"),
#             models.Caballero.ca_experience.label("experiencia"),
#             models.Caballero.ca_gold.label("oro"),
#             models.Caballero.ca_hability.label("habilidad"),
#             models.Caballero.ca_health.label("salud"),
#             models.Caballero.ca_health_act.label("salud_actual"),
#             models.Caballero.ca_velocity.label("velocidad"),
#             models.Caballero.ca_power.label("poder"),
#             models.Caballero.ca_knowledge.label("conocimiento"),
#             models.Caballero.ca_precision.label("precision"),
#             models.Caballero.ca_agility.label("agilidad"),
#             models.Caballero.ca_resistance.label("resistencia"),
#             models.Caballero.ca_psy_resistance.label("resistencia_mental"),
#             models.Caballero.ca_persistence.label("persistencia"),
#             models.Caballero.ca_cosmo.label("cosmo"),
#             models.Caballero.ca_cosmo_act.label("cosmo_actual"),
#             models.Caballero.ca_seventh_sense.label("septimo_sentido"),
#             models.Caballero.ca_seventh_sense_act.label("septimo_sentido_actual"),
#             models.Caballero.ca_honor.label("honor"),
#             models.Caballero.ca_win.label("victorias"),
#             models.Caballero.ca_loss.label("derrotas"),
#             models.Caballero.ca_zon_key_act.label("zona_actual"),
#             models.Caballero.ca_status.label("estado"),
#             models.Caballero.ca_status_player.label("jugando"),
#             models.Caballero.ca_createdate.label("fecha_creacion"),
#             models.Caballero.ca_lastlogin.label("ultimo_login"),
#             models.Caballero.ca_lastaction.label("ultima_accion"),
#             models.Caballero.ca_msg_win.label("mensaje_victoria"),
#             models.Caballero.ca_msg_loss.label("mensaje_derrota"),
#             models.Caballero.ca_img_main.label("imagen_principal"),
#             models.Caballero.ca_img_win.label("imagen_victoria"),
#             models.Caballero.ca_img_loss.label("imagen_derrota"),
#             models.Caballero.ca_di_key.label("id_divinidad"),
#             models.Caballero.ca_zo_key.label("id_signo"),
#             models.Zodiaco.zo_name.label("signo_name"),
#             models.Divinidad.di_name.label("divinidad_name"),
#             models.Zona.zon_name.label("zona")
#         )
#         .join(models.Zodiaco, models.Caballero.ca_zo_key == models.Zodiaco.zo_key)
#         .join(models.Divinidad, models.Caballero.ca_di_key == models.Divinidad.di_key)
#         .join(models.Zona, models.Caballero.ca_zon_key_act == models.Zona.zon_key)
#         .filter(models.Caballero.ca_ac_key == account_id)
#     )

#     rows = query.all()
#     return [CaballeroOut(**dict(row._mapping)) for row in rows]

def get_contrincantes(
    db: Session,
    nombre: Optional[str] = None,
    nivel: Optional[int] = None,
    signo: Optional[str] = None,
    deidad: Optional[str] = None,
    zona: int = 1,
    account: int = 0,
    nivel_act: int = 0
) -> Optional[dict]:

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
            models.Caballero.ca_img_main.label("imagen_principal")
        )
        .join(models.Zodiaco, models.Caballero.ca_zo_key == models.Zodiaco.zo_key)
        .join(models.Divinidad, models.Caballero.ca_di_key == models.Divinidad.di_key)
        .filter(models.Caballero.ca_status_player == 1)
        #.filter((models.Caballero.ca_health_act * 100) / models.Caballero.ca_health > 20)
        .filter(models.Caballero.ca_zon_key_act == zona)
        .filter(models.Caballero.ca_ac_key != account)
    )

    if nombre:
        query = query.filter(models.Caballero.ca_name.ilike(f"%{nombre}%"))
    else:
        if nivel:
            query = query.filter(models.Caballero.ca_level == nivel)
        else:
            query = query.filter(models.Caballero.ca_level >0)        
        if signo:
            query = query.filter(models.Zodiaco.zo_name.ilike(f"%{signo}%"))
        if deidad:
            query = query.filter(models.Divinidad.di_name.ilike(f"%{deidad}%"))

    result = query.order_by(func.random()).limit(1).first()

    print(result)

    if not result:
        return None  # o [{"mensaje": "No hay contrincantes disponibles"}]

    return dict(result._mapping)


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


#Programadas:
def regenerar_vida(db: Session):
    """
    Regenera 0.08% de la vida total cada 3 segundos.
    Topado al máximo (ca_health).
    """
    query = text("""
        UPDATE Caballero
        SET ca_health_act = LEAST(
            ca_health,
            ca_health_act + GREATEST(1, ROUND(ca_health / 1200))
        )
        WHERE ca_health_act < ca_health;
    """)
    db.execute(query)
    db.commit()

def actualizar_estados(db: Session):
    """
    1) Cierra historiales vencidos (hi_active=0) y guarda duración.
    2) Actualiza ca_status con el ÚLTIMO estado activo != 'Descansando de la defensa'.
    3) Si no tiene estado activo (o solo tiene 'Descansando de la defensa'), pasa a 'Listo'.
    """

    # 1) Cerrar historiales vencidos
    q1 = text("""
        UPDATE Historial_Estado
        SET hi_active = 0,
            hi_duration_min = TIMESTAMPDIFF(MINUTE, hi_start_time, hi_end_time)
        WHERE hi_active = 1
          AND NOW() >= hi_end_time;
    """)
    db.execute(q1)

    # 2) Poner el estado más reciente activo (distinto a 'Descansando de la defensa')
    #    Usamos una subconsulta que trae el MAX(hi_end_time) por caballero y hacemos JOIN
    q2 = text("""
        UPDATE Caballero c
        JOIN (
            SELECT he.hi_ca_key, e.es_name
            FROM Historial_Estado he
            JOIN Estados e ON e.es_key = he.hi_es_key
            JOIN (
                SELECT h.hi_ca_key, MAX(h.hi_end_time) AS max_end
                FROM Historial_Estado h
                JOIN Estados e2 ON e2.es_key = h.hi_es_key
                WHERE h.hi_active = 1
                  AND e2.es_name <> 'Descansando de la defensa'
                GROUP BY h.hi_ca_key
            ) last ON last.hi_ca_key = he.hi_ca_key AND last.max_end = he.hi_end_time
            WHERE he.hi_active = 1
              AND e.es_name <> 'Descansando de la defensa'
        ) activos ON activos.hi_ca_key = c.ca_key
        SET c.ca_status = activos.es_name;
    """)
    db.execute(q2)

    # 3) Los que NO tienen ningún activo distinto a 'Descansando de la defensa' -> 'Listo'
    q3 = text("""
        UPDATE Caballero c
        LEFT JOIN (
            SELECT DISTINCT h.hi_ca_key
            FROM Historial_Estado h
            JOIN Estados e ON e.es_key = h.hi_es_key
            WHERE h.hi_active = 1
              AND e.es_name <> 'Descansando de la defensa'
        ) a ON a.hi_ca_key = c.ca_key
        SET c.ca_status = 'Listo'
        WHERE a.hi_ca_key IS NULL;
    """)
    db.execute(q3)

    db.commit()
   
def verificar_nivel(db: Session):
    """
    Sube de nivel cuando alcanza el requisito del siguiente nivel.
    Solo sube un nivel por ciclo (no hay saltos).
    """
    query = text("""
        UPDATE Caballero c
        JOIN Niveles n ON n.ni_level = c.ca_level + 1
        SET 
            c.ca_level = c.ca_level + 1,
            c.ca_gold  = c.ca_gold + n.ni_oro_reward
        WHERE c.ca_experience >= n.ni_exp_necessary;
    """)
    db.execute(query)
    db.commit()