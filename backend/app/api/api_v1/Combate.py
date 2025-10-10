from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.api_v1.auth import get_current_user
from typing import List, Optional
from app.crud import caballero as CaballeroCRUD
from app.schemas import Caballero as CaballeroSchema
from app.db import get_db
from datetime import datetime
from app.operations.entrenar import *
from app.operations.combate import combate
from app.models import Caballero as CaballeroModel
from pydantic import BaseModel
from app.models import Combate as CombateModel
from app.schemas import Combate as CombateSchema
from app.operations.combate_aggregator import aggregate_from_result


router = APIRouter()

class FightRequest(BaseModel):
    p1_id: int
    p2_id: int
    tipo: str
    quest_id: Optional[int] = None  # si es parte de una quest/evento especial


# endpoint
@router.post("/simular_combate")
def simular_combate(req: FightRequest, db: Session = Depends(get_db)):
    try:
        p1 = db.query(CaballeroModel).filter(CaballeroModel.ca_key == req.p1_id).first()
        if req.tipo == "duelo":            
            p2 = db.query(CaballeroModel).filter(CaballeroModel.ca_key == req.p2_id).first()

        if not p1 or not p2:
            return {"error": "Caballero no encontrado"}

        def to_dict(c):
            return {
                "ca_name": c.ca_name,
                "ca_health": c.ca_health,
                "ca_health_act": c.ca_health_act,
                "ca_velocity": c.ca_velocity,
                "ca_power": c.ca_power,
                "ca_knowledge": c.ca_knowledge,
                "ca_precision": c.ca_precision,
                "ca_agility": c.ca_agility,
                "ca_resistance": c.ca_resistance,
                "ca_psy_resistance": c.ca_psy_resistance,
                "ca_persistence": c.ca_persistence,
                "ca_cosmo": c.ca_cosmo,
                "ca_cosmo_act": c.ca_cosmo_act,
                "ca_seventh_sense": c.ca_seventh_sense,
                "ca_seventh_sense_act": c.ca_seventh_sense_act,
                "ca_level": c.ca_level,
                "ca_gold": c.ca_gold

            }

        p1_dict = to_dict(p1)
        p2_dict = to_dict(p2)

        # 1) correr combate → incluye events con template_index y templates.version
        resultado = combate(p1_dict, p2_dict, rondas=25)

        # 2) armar payload para persistir (snapshot completo)
        payload = {
            "participants": resultado.get("debug", {}).get("stats_iniciales"),
            "stats_mod":    resultado.get("debug", {}).get("stats_modificados"),
            "events":       resultado.get("events"),         # cada evento tiene template_index
            "final_stats":  resultado.get("final_stats"),
            "ganador":      resultado.get("ganador"),
            "perdedor":     resultado.get("perdedor"),
            "motivo":       resultado.get("motivo"),
            "rng_seed":     resultado.get("rng_seed_battle"),
            "templates":    resultado.get("templates", {"version": "pack-v1"}),
            
        }

        # 3) agregar métricas denormalizadas para el modelo
        cols = aggregate_from_result(
            p1_id=p1.ca_key, p2_id=p2.ca_key,
            p1_name=p1.ca_name, p2_name=p2.ca_name,
            resultado=resultado
        )

        # (Opcional) Si tienes deidad/rango en CaballeroModel, guárdalos como snapshot textual:
        cols["attacker_deity"] = getattr(p1, "ca_di_key", None)
        cols["defender_deity"] = getattr(p2, "ca_di_key", None)
        #cols["attacker_rank"]  = getattr(p1, "ca_rank", None)
        #cols["defender_rank"]  = getattr(p2, "ca_rank", None)
        cols["battle_type"] = "duelo"  # hardcodeado por ahora
        cols["battle_quest_id"] = req.quest_id
        if req.tipo == "duelo":
            cols["battle_npc_id"] = None
        if req.tipo == "enemigo":
            cols["battle_npc_id"] = p2.ca_key
        if req.quest_id:
            cols["battle_quest_id"] = req.quest_id
            cols["battle_background"] = "coliseo"  # hardcodeado por ahora

        #print("Tipo CombateModel:", type(CombateModel))
        #print("Tiene atributo Combate?:", hasattr(CombateModel, "Combate"))

            
        # 4) persistir Combate con todas las columnas + payload
        combate_row = CombateModel(
            **cols,
            co_comments=None,
            payload=payload
        )
        db.add(combate_row)
        db.commit()
        db.refresh(combate_row)

        # 5) responder como antes, con id incluido (para FE)
        return {
            "id": combate_row.co_key,
            **resultado
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}



@router.get("/combates/{battle_id}")
def get_combate(battle_id: int, db: Session = Depends(get_db)):
    row = db.query(CombateModel).filter(CombateModel.co_key == battle_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        "id": row.co_key,
        "battle_type": row.battle_type,
        "battle_quest_id": row.battle_quest_id,
        "battle_background": row.battle_background,
        **(row.payload or {})
    }

