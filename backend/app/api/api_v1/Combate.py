from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.api_v1.auth import get_current_user
from typing import List, Optional
from app.crud import caballero as CaballeroCRUD
from app.schemas import Caballero as CaballeroSchema
from app.db import get_db
from datetime import datetime, timedelta
from app.operations.entrenar import *
from app.operations.combate import combate
from app.models import Caballero as CaballeroModel
from app.models import Boost as BoostModel
from pydantic import BaseModel
from app.models import Combate as CombateModel
from app.schemas import Combate as CombateSchema
from app.operations.combate_aggregator import aggregate_from_result
from app.models import Estados, HistorialEstado
from app.crud.Estado import check_active_status

router = APIRouter()

class FightRequest(BaseModel):
    p1_id: int
    p2_id: int
    tipo: str
    quest_id: Optional[int] = None  # si es parte de una quest/evento especial


@router.post("/simular_combate")
def simular_combate(req: FightRequest, db: Session = Depends(get_db)):
    try:
        with db.begin():
            if req.tipo != "duelo" and req.tipo != "enemigo" and req.tipo != "quest":
                return {"error":"Debe indicar el tipo de combate a realizar."}
            
             
            # === 1️⃣ Cargar caballeros ===
            p1 = (
                db.query(CaballeroModel)
                .with_for_update()
                .filter(CaballeroModel.ca_key == req.p1_id)
                .first()
            )
            if req.tipo =="duelo":
                p2 = db.query(CaballeroModel).with_for_update().filter(CaballeroModel.ca_key == req.p2_id).first()
            elif req.tipo =="enemigo":
                p2 = None #Aun no se define modelo de enemigos
            else:
                p2= None
           
            if not p1 or not p2:
                return {"error": "Caballero a enfrentar no definido!"}
            if(((100*p1.ca_health_act)/p1.ca_health)<10):
                return {"error":"Tu salud está por debajo del 10%, no puedes pelear de momento."}
            
            if(((100*p2.ca_health_act)/p2.ca_health)<10):
                return {"error":"La salud de tu rival es muy baja, no puedes atacarlo en este momento. Intenta mas tarde"}


            # === 2️⃣ Validar estados activos ===
            if check_active_status(db, p1.ca_key, "Descansando de la batalla"):
                return {"error": "Te encuentras descansando de tu última batalla, descansa antes de volver a pelear."}
            if req.tipo == "duelo" and check_active_status(db, p2.ca_key, "Descansando de la defensa"):
                return {"error": f"{p2.ca_name} enfrentó una defensa recientemente, no puedes atacarlo de momento. Intenta mas tarde."}

            # === 3️⃣ Insertar estados bloqueantes ===
            estado_ataque = db.query(Estados).filter(Estados.es_name == "Descansando de la batalla").first()
            if not estado_ataque:
                return {"error": "Estado 'Descansando de la batalla' no configurado."}

            hi_ataque = HistorialEstado(
                hi_ca_key=p1.ca_key,
                hi_zon_key=p1.ca_zon_key_act,
                hi_es_key=estado_ataque.es_key,
                hi_start_time=datetime.utcnow(),
                hi_end_time=datetime.utcnow() + timedelta(minutes=estado_ataque.es_default_time),
                hi_active=True,
            )
            db.add(hi_ataque)
            db.flush()
            hi_ataque_key = hi_ataque.hi_key

            hi_defensa_key = None
            if req.tipo == "duelo":
                estado_defensa = db.query(Estados).filter(Estados.es_name == "Descansando de la defensa").first()
                if not estado_defensa:
                    return {"error": "Estado 'Descansando de la defensa' no configurado."}

                hi_defensa = HistorialEstado(
                    hi_ca_key=p2.ca_key,
                    hi_zon_key=p2.ca_zon_key_act,
                    hi_es_key=estado_defensa.es_key,
                    hi_start_time=datetime.utcnow(),
                    hi_end_time=datetime.utcnow() + timedelta(minutes=estado_defensa.es_default_time),
                    hi_active=True,
                )
                db.add(hi_defensa)
                db.flush()
                hi_defensa_key = hi_defensa.hi_key

            # === 4️⃣ Preparar boosts y simular combate ===
            p1_boosts = db.query(BoostModel).filter(
                ((BoostModel.bo_type == "Deidad") & (BoostModel.bo_origin == p1.ca_di_key))
                | ((BoostModel.bo_type == "Signo") & (BoostModel.bo_origin == p1.ca_zo_key))
            ).all()
            p2_boosts = db.query(BoostModel).filter(
                ((BoostModel.bo_type == "Deidad") & (BoostModel.bo_origin == p2.ca_di_key))
                | ((BoostModel.bo_type == "Signo") & (BoostModel.bo_origin == p2.ca_zo_key))
            ).all()

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
                    "ca_gold": c.ca_gold,
                    "ca_img_win": c.ca_img_win,
                    "ca_img_loss": c.ca_img_loss,
                    "ca_img_main": c.ca_img_main,
                    "ca_msg_win": c.ca_msg_win,
                    "ca_msg_loss": c.ca_msg_loss,
                }

            p1_dict, p2_dict = to_dict(p1), to_dict(p2)
            resultado = combate(p1_dict, p2_dict, p1_boosts, p2_boosts, rondas=25)

            # === 5️⃣ Determinar ganadores y niveles ===
            ganador_name = resultado.get("ganador")
            perdedor_name = resultado.get("perdedor")
            ganador = p1 if p1.ca_name == ganador_name else p2
            perdedor = p2 if ganador == p1 else p1
            nivel_g, nivel_p = ganador.ca_level, perdedor.ca_level

            oro_robado, oro_base = 0, 0
            drop_item, drop_armadura = None, None
            win_increment, loss_increment = 0,0
            recompensas_payload = {}

            # === 6️⃣ Calcular recompensas ===
            if req.tipo == "duelo":
                # Oro base según diferencia de niveles
                if nivel_g == nivel_p:
                    oro_base = 5 * nivel_g
                    oro_pct, exp_g, exp_p, hab_g, hab_p, win_increment, loss_increment = 0.25, 1, 1, 1, 1, 1, 1
                elif nivel_g < nivel_p:
                    oro_base = 8 * nivel_g
                    oro_pct, exp_g, exp_p, hab_g, hab_p, win_increment, loss_increment = 0.35, 2, 0, 2, 0, 1, 1
                else:
                    oro_base = 3 * nivel_g
                    oro_pct, exp_g, exp_p, hab_g, hab_p, win_increment, loss_increment = 0.15, 2, 0, 1, 0, 0, 0

                oro_robado = int(perdedor.ca_gold * oro_pct)
                total_oro_ganado = oro_base + oro_robado

                ganador.ca_gold += total_oro_ganado
                perdedor.ca_gold = max(0, perdedor.ca_gold - oro_robado)
                ganador.ca_experience += exp_g
                perdedor.ca_experience += exp_p
                ganador.ca_hability += hab_g
                perdedor.ca_hability += hab_p
                ganador.ca_win += win_increment
                perdedor.ca_loss += loss_increment

                db.add_all([ganador, perdedor])

                recompensas_payload = {
                    "oro_ganado": total_oro_ganado,
                    "oro_robado": oro_robado,
                    "oro_base": oro_base,
                    "exp_ganador": exp_g, "exp_perdedor": exp_p,
                    "hab_ganador": hab_g, "hab_perdedor": hab_p,
                }

            elif req.tipo == "enemigo":
                pj_lvl, npj_lvl = p1.ca_level, p2.ca_level
                gano = (ganador == p1)
                perdio = not gano

                if npj_lvl == pj_lvl:
                    oro_base = 10 * pj_lvl
                    exp, hab = 1, 1
                elif npj_lvl > pj_lvl:
                    oro_base = 20 * pj_lvl
                    exp, hab = 2, 2
                else:
                    oro_base = 5 * pj_lvl
                    exp, hab = 0, 0

                if gano:
                    p1.ca_gold += oro_base
                    p1.ca_experience += exp
                    p1.ca_hability += hab
                else:
                    oro_perdido = int(p1.ca_gold * 0.15)
                    p1.ca_gold = max(0, p1.ca_gold - oro_perdido)
                    oro_base = -oro_perdido

                # (futuro) dropeo de ítem / armadura
                drop_item, drop_armadura = None, None

                db.add(p1)
                recompensas_payload = {
                    "oro_ganado": oro_base if gano else 0,
                    "oro_perdido": -oro_base if perdio else 0,
                    "exp_ganado": exp if gano else 0,
                    "hab_ganado": hab if gano else 0,
                }

            # === 7️⃣ Registrar combate ===
            cols = aggregate_from_result(
                p1_id=p1.ca_key, p2_id=p2.ca_key,
                p1_name=p1.ca_name, p2_name=p2.ca_name,
                resultado=resultado
            )
            salud_p1 = resultado["final_stats"]["p1"]["salud_final"]
            salud_p2 = resultado["final_stats"]["p2"]["salud_final"]

            if req.tipo == "duelo":
                p2.ca_health_act = salud_p2
                db.add(p2)
            p1.ca_health_act = salud_p1
            db.add(p1)
            
            # Registramos la vida restante

            cols["battle_type"] = req.tipo
            cols["battle_npc_id"] = p2.ca_key if req.tipo == "enemigo" else None
            cols["battle_quest_id"] = req.quest_id

            payload = {
                "participants": resultado.get("debug", {}).get("stats_iniciales"),
                "stats_mod": resultado.get("debug", {}).get("stats_modificados"),
                "events": resultado.get("events"),
                "final_stats": resultado.get("final_stats"),
                "ganador": ganador_name,
                "perdedor": perdedor_name,
                "oro_base": oro_base,
                "oro_robado": oro_robado,
                "recompensas": recompensas_payload,
                "drop_item": drop_item,
                "drop_armadura": drop_armadura,
                "pj1_img_principal": resultado.get("pj1_img_principal"),
                "pj2_img_principal": resultado.get("pj2_img_principal"),
                "ganador_msg": resultado.get("ganador_msg"),
                "ganador_img": resultado.get("ganador_img"),
                "perdedor_msg": resultado.get("perdedor_msg"),
                "perdedor_img": resultado.get("perdedor_img"),
                "motivo": resultado.get("motivo"),
                "rng_seed": resultado.get("rng_seed_battle"),
                "templates": resultado.get("templates", {"version": "pack-v1"}),
            }

            combate_row = CombateModel(**cols, payload=payload)
            db.add(combate_row)
            db.flush()

            # === 8️⃣ Actualizar estados con source/result ===
            db.query(HistorialEstado).filter(HistorialEstado.hi_key == hi_ataque_key).update(
                {
                    HistorialEstado.hi_source: f"Batalla?id={combate_row.co_key}",
                    HistorialEstado.hi_result: "Victoria" if ganador == p1 else "Derrota",
                }
            )
            if hi_defensa_key:
                db.query(HistorialEstado).filter(HistorialEstado.hi_key == hi_defensa_key).update(
                    {
                        HistorialEstado.hi_source: f"Batalla?id={combate_row.co_key}",
                        HistorialEstado.hi_result: "Victoria" if ganador == p2 else "Derrota",
                    }
                )

            set_caballero = (
                db.query(CaballeroModel)
                .with_for_update()
                .filter(CaballeroModel.ca_key == req.p1_id)
                .first()
            )
            caballero_schema = CaballeroSchema.CaballeroOut.from_orm(set_caballero)


            # === 9️⃣ Return original (manteniendo compatibilidad con tu FE) ===
            return {
                "id": combate_row.co_key, "caballero":caballero_schema,
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

