# combate.py (refactor a eventos)

from asyncio import events
import random, math
from typing import Dict, Any, List

STATS_MAP = {
  "Velocidad": "ca_velocity",
  "Fuerza": "ca_power",
  "Sabiduría": "ca_knowledge",
  "Precisión": "ca_precision",
  "Presición": "ca_precision",
  "Reflejos": "ca_agility",
  "Agilidad": "ca_agility",
  "Resistencia": "ca_resistance",
  "Resistencia Psíquica": "ca_psy_resistance",
  "Persistencia": "ca_persistence",
  "Cosmo": "ca_cosmo_act",
  "Séptimo Sentido": "ca_sevent_sense_act",
  "Vida Máxima": "ca_health_act",
}


TPL_SIZE = {
    "ataque_hit": 25,
    "ataque_resistido": 25,
    "esquiva": 25,
    "contraataque": 25,
    "persistencia": 25,
    "muerte": 25,
    "victoria": 25,
    "empate": 25,
}

def pick_tpl_index(tipo: str) -> int:
    n = TPL_SIZE.get(tipo, 25)
    return random.randint(0, max(0, n-1))

# ===============================
# Constantes de balance
# ===============================
S_INICIATIVA = 200
S_DANO = 50
MAX_CONTRAATAQUE = 0.25
PERSISTENCIA_BASE = 0.75
CRITICO_BASE = 1.5
CRITICO_MAX = 2.0
RONDAS_BATALLA = 25
# ===============================

# ===============================
# Auxiliares
# ===============================
def sigmoid_probability(diff: float, s: float) -> float:
    return 1.0 / (1.0 + math.exp(-diff / s))

def sample_multiplier(p_win: float, dificultad: float = 2.0) -> float:
    x = random.random()
    sesgo = 0.5 + (p_win - 0.5) * 0.5
    biased = x ** dificultad
    return CRITICO_BASE + biased * (CRITICO_MAX - CRITICO_BASE) * sesgo

def calcular_dano(ofensiva: float, defensiva: float, s: float = S_DANO, dificultad: float = 2.0) -> int:
    diff = ofensiva - defensiva
    p_atq = sigmoid_probability(diff, s)
    atacante_gana = (random.random() <= p_atq)

    if atacante_gana:
        mult = sample_multiplier(p_atq, dificultad)
        ofensiva_total = ofensiva * mult
        defensiva_total = defensiva
    else:
        mult = sample_multiplier(1.0 - p_atq, dificultad)
        ofensiva_total = ofensiva
        defensiva_total = defensiva * mult

    if ofensiva_total <= defensiva_total:
        return 0
    return max(1, round(random.uniform(1, ofensiva_total - defensiva_total)))

def check_iniciativa(v1: float, v2: float) -> bool:
    diff = v1 - v2
    p1_win = sigmoid_probability(diff, S_INICIATIVA)
    return random.random() <= p1_win

def check_impacto(precision: float, agilidad: float) -> bool:
    p_hit = precision / (precision + agilidad + 1)
    return random.random() <= p_hit

def check_contraataque(agilidad: float, precision_rival: float) -> bool:
    ratio = agilidad / (agilidad + precision_rival + 1)
    p_counter = ratio * MAX_CONTRAATAQUE
    return random.random() <= p_counter

def check_persistencia(persistencia: float) -> bool:
    chance = min(1.0, PERSISTENCIA_BASE * (persistencia / 100.0))
    return random.random() <= chance

def aplicar_modificadores(s: Dict[str, Any], boosts) -> Dict[str, Any]:
    for b in boosts:
        
        if b.get('bo_unit') == '%':
            s[b.get('bo_stat')] += s[b.get('bo_stat')] * ((b.get('bo_quantity'))/100)
            if b.get('bo_stat') == 'ca_health_act':
                s['ca_health'] += s['ca_health'] * ((b.get('bo_quantity'))/100)
            if b.get('bo_stat') == 'ca_cosmo_act':
                s['ca_cosmo'] += s['ca_cosmo'] * ((b.get('bo_quantity'))/100)    
            if b.get('bo_stat') == 'ca_seventh_sense_act':
                s['ca_seventh_sense'] += s['ca_seventh_sense'] * ((b.get('bo_quantity'))/100)    
        else:
            s[b.get('bo_stat')] += s[b.get('bo_stat')]+b.get('bo_quantity')
            if b.get('bo_stat') == 'ca_health_act':
                s['ca_health'] += s['ca_health'] + ((b.get('bo_quantity')))
            if b.get('bo_stat') == 'ca_cosmo_act':
                s['ca_cosmo'] += s['ca_cosmo'] + ((b.get('bo_quantity')))
            if b.get('bo_stat') == 'ca_seventh_sense_act':
                s['ca_seventh_sense'] += s['ca_seventh_sense'] + ((b.get('bo_quantity')))

    s = s.copy()
    s["ca_resistance"] += s["ca_power"] * 0.10
    s["ca_psy_resistance"] += s["ca_power"] * 0.10
    s["ca_persistence"] += s["ca_knowledge"] * 0.10
    s["ca_power"] += s["ca_precision"] * 0.10
    s["ca_knowledge"] += s["ca_precision"] * 0.10
    s["ca_velocity"] += s["ca_agility"] * 0.10
    s["ca_cosmo"] += s["ca_resistance"] * 0.10
    s["ca_cosmo"] += s["ca_psy_resistance"] * 0.10
    if s.get("ca_seventh_sense", 0) >= 100:
        for key in ["ca_velocity","ca_power","ca_knowledge","ca_precision","ca_agility",
                    "ca_resistance","ca_psy_resistance","ca_persistence","ca_cosmo"]:
            s[key] *= 1.05
        s["evadir_control_bonus"] = 0.10
    else:
        s["evadir_control_bonus"] = 0.0
    return s

# ===============================
# Motor de combate → eventos para FE
# ===============================
def combate(p1: Dict[str, Any], p2: Dict[str, Any],p1_boosts, p2_boosts, rondas: int = RONDAS_BATALLA) -> Dict[str, Any]:
    
    def to_dict_boost(boosts):
        boostsList = []        
        for b in boosts:
            boostsList.append({"bo_key":b.bo_key, "bo_unit":b.bo_unit, "bo_quantity":b.bo_quantity, "bo_stat":STATS_MAP.get(b.bo_stat)})
        return boostsList
    
    p1_boosts_list = to_dict_boost(p1_boosts)
    p2_boosts_list = to_dict_boost(p2_boosts)

    rondas = RONDAS_BATALLA
    events: List[Dict[str, Any]] = []
    debug: Dict[str, Any] = {
        "stats_iniciales": {"p1": p1.copy(), "p2": p2.copy()},
        "stats_modificados": {},
        "probabilidades": []
    }

    # Daño acumulado
    dmg_total_p1 = 0
    dmg_total_p2 = 0

    # Aplicar modificadores
    stats1 = aplicar_modificadores(p1, p1_boosts_list)
    stats2 = aplicar_modificadores(p2, p2_boosts_list)
    debug["stats_modificados"] = {"p1": stats1.copy(), "p2": stats2.copy()}

    # Por reproducibilidad de plantillas en FE (opcional)
    # guardamos un seed global (el FE puede ignorarlo y usar su propio RNG)
    battle_seed = random.getrandbits(32)

    for r in range(1, rondas+1):
        if stats1["ca_health_act"] <= 0 or stats2["ca_health_act"] <= 0:
            break

        # Evento de inicio de ronda (para headers y animaciones)
        events.append({
        "type": "round_start",
        "ronda": r,
        "vars": {
            "hp_act_p1": stats1["ca_health_act"],
            "hp_act_p2": stats2["ca_health_act"],
            "cosmo_act_p1": stats1.get("ca_cosmo_act", 0),
            "cosmo_act_p2": stats2.get("ca_cosmo_act", 0)
        }
    })

        # ===== Iniciativa
        diff_vel = stats1["ca_velocity"] - stats2["ca_velocity"]
        p1_iniciativa = sigmoid_probability(diff_vel, S_INICIATIVA)
        prob_ronda: Dict[str, Any] = {
            "ronda": r,
            "p1_iniciativa": round(p1_iniciativa, 3),
            "p2_iniciativa": round(1 - p1_iniciativa, 3)
        }
        debug["probabilidades"].append(prob_ronda)

        if check_iniciativa(stats1["ca_velocity"], stats2["ca_velocity"]):
            atacante, defensor = stats1, stats2
            nombre_atq, nombre_def = p1["ca_name"], p2["ca_name"]
            prob_ronda["atacante"] = "p1"
            atacanteClass = "pj1"
            defensorClass = "pj2"
        else:
            atacante, defensor = stats2, stats1
            nombre_atq, nombre_def = p2["ca_name"], p1["ca_name"]
            prob_ronda["atacante"] = "p2"
            atacanteClass = "pj2"
            defensorClass = "pj1"

        # ===== Impacto
        p_hit = atacante["ca_precision"] / (atacante["ca_precision"] + defensor["ca_agility"] + 1)
        prob_ronda["p_impacto"] = round(p_hit, 3)

        # Fallo → esquiva (y posible contraataque)
        if not check_impacto(atacante["ca_precision"], defensor["ca_agility"]):
            events.append({
                "type": "esquiva",
                "vars": {
                    "atacante": nombre_atq,
                    "atacanteClass": atacanteClass,
                    "defensorClass": defensorClass,
                    "defensor": nombre_def,
                    "hp_act_atacante": atacante["ca_health_act"],   # <-- antes ponías defensor
                    "hp_act_defensor": defensor["ca_health_act"],   # <-- antes ponías atacante
                    "cosmo_act_atacante": atacante.get("ca_cosmo_act", 0),
                    "cosmo_act_defensor": defensor.get("ca_cosmo_act", 0)
                },
                "template_index": pick_tpl_index("esquiva")
            })


            # ===== Contraataque
            ratio = defensor["ca_agility"] / (defensor["ca_agility"] + atacante["ca_precision"] + 1)
            p_counter = ratio * MAX_CONTRAATAQUE
            prob_ronda["p_contra"] = round(p_counter, 3)

            if check_contraataque(defensor["ca_agility"], atacante["ca_precision"]):
                dmg = calcular_dano(defensor["ca_power"], (atacante["ca_resistance"]*0.3))
                atacante["ca_health_act"] -= dmg
                if prob_ronda["atacante"] == "p1":
                    dmg_total_p2 += dmg
                else:
                    dmg_total_p1 += dmg

                events.append({
                "type": "contraataque",
                "vars": {
                    "atacante": nombre_def,   # el que contraataca pega
                    "defensor": nombre_atq, 
                    "atacanteClass": atacanteClass,
                    "defensorClass": defensorClass,  # recibe
                    "dmg": dmg,
                    "hp_act_atacante": defensor["ca_health_act"],
                    "hp_act_defensor": atacante["ca_health_act"],
                    "cosmo_act_atacante": defensor.get("ca_cosmo_act", 0),
                    "cosmo_act_defensor": atacante.get("ca_cosmo_act", 0)
                },
                "template_index": pick_tpl_index("contraataque")
            })

            continue

        # ===== Golpe exitoso (solo físico por ahora)
        dmg = calcular_dano(atacante["ca_power"], defensor["ca_resistance"])
        tipo = "físico"
        defensor["ca_health_act"] -= dmg

        if dmg > 0:
            events.append({
                "type": "ataque_hit",
                "vars": {
                    "atacante": nombre_atq,
                    "defensor": nombre_def,
                    "atacanteClass": atacanteClass,
                    "defensorClass": defensorClass,
                    "dmg": dmg,
                    "tipo": tipo,
                    "hp_act_atacante": atacante["ca_health_act"],
                    "hp_act_defensor": defensor["ca_health_act"],
                    "cosmo_act_atacante": atacante.get("ca_cosmo_act", 0),
                    "cosmo_act_defensor": defensor.get("ca_cosmo_act", 0)
                },
                "template_index": pick_tpl_index("ataque_hit")
            })
        else:
            events.append({
                "type": "ataque_resistido",
                "vars": {
                    "atacante": nombre_atq,
                    "defensor": nombre_def,
                    "atacanteClass": atacanteClass,
                    "defensorClass": defensorClass,
                    "dmg": dmg,
                    "tipo": tipo,
                    "hp_act_atacante": atacante["ca_health_act"],
                    "hp_act_defensor": defensor["ca_health_act"],
                    "cosmo_act_atacante": atacante.get("ca_cosmo_act", 0),
                    "cosmo_act_defensor": defensor.get("ca_cosmo_act", 0)
                },
                "template_index": pick_tpl_index("ataque_resistido")
            })

        # Acumular daño
        if prob_ronda["atacante"] == "p1":
            dmg_total_p1 += dmg
        else:
            dmg_total_p2 += dmg

        # ===== Persistencia
        chance_revive = min(1.0, PERSISTENCIA_BASE * (defensor["ca_persistence"] / 100.0))
        prob_ronda["p_revive"] = round(chance_revive, 3)

        if defensor["ca_health_act"] <= 0:
            if check_persistencia(defensor["ca_persistence"]):
                defensor["ca_health_act"] = int(defensor["ca_health"] * 0.25)
                events.append({
                "type": "persistencia",
                "vars": {
                    "defensor": nombre_def,
                    "atacanteClass": atacanteClass,
                    "defensorClass": defensorClass,
                    "hp_act_atacante": atacante["ca_health_act"],
                    "hp_act_defensor": defensor["ca_health_act"],
                    "cosmo_act_atacante": atacante.get("ca_cosmo_act", 0),
                    "cosmo_act_defensor": defensor.get("ca_cosmo_act", 0)
                },
                "template_index": pick_tpl_index("persistencia")
            })

            else:
                events.append({
                    "type": "muerte",
                    "vars": {
                    "defensor": nombre_def,
                    "atacanteClass": atacanteClass,
                    "defensorClass": defensorClass,
                    "hp_act_atacante": atacante["ca_health_act"],
                    "hp_act_defensor": defensor["ca_health_act"],
                    "cosmo_act_atacante": atacante.get("ca_cosmo_act", 0),
                    "cosmo_act_defensor": defensor.get("ca_cosmo_act", 0)
                    },
                    "template_index": pick_tpl_index("muerte")
                })
                break

    # ======================
    # Determinar ganador
    # ======================
    ganador = None
    perdedor = None
    motivo = None
    if stats1["ca_health_act"] <= 0 and stats2["ca_health_act"] > 0:
        ganador, perdedor, motivo, ganadorClass, perdedorClass, ganador_img, ganador_text, perdedor_img, perdedor_text = p2["ca_name"], p1["ca_name"], "KO", "pj2", "pj1", p2["ca_img_win"], p2["ca_msg_win"],  p1["ca_img_loss"], p1["ca_msg_loss"]
    elif stats2["ca_health_act"] <= 0 and stats1["ca_health_act"] > 0:
        ganador, perdedor, motivo, ganadorClass, perdedorClass, ganador_img, ganador_text, perdedor_img, perdedor_text = p1["ca_name"], p2["ca_name"], "KO", "pj1", "pj2", p1["ca_img_win"], p1["ca_msg_win"],  p2["ca_img_loss"], p2["ca_msg_loss"]
    else:
        if dmg_total_p1 > dmg_total_p2:
            ganador, perdedor, motivo, ganadorClass, perdedorClass, ganador_img, ganador_text, perdedor_img, perdedor_text = p1["ca_name"], p2["ca_name"], "daño acumulado", "pj1", "pj2", p1["ca_img_win"], p1["ca_msg_win"],  p2["ca_img_loss"], p2["ca_msg_loss"]
        elif dmg_total_p2 > dmg_total_p1:
            ganador, perdedor, motivo, ganadorClass, perdedorClass, ganador_img, ganador_text, perdedor_img, perdedor_text = p2["ca_name"], p1["ca_name"], "daño acumulado", "pj2", "pj1", p2["ca_img_win"], p2["ca_msg_win"],  p1["ca_img_loss"], p1["ca_msg_loss"]

    # Evento final
    if ganador:
        events.append({
            "type": "victoria",
            "vars": {"ganador": ganador, "perdedor": perdedor, "motivo": motivo,  "hp_act_p1": stats1["ca_health_act"],
            "ganadorClass": ganadorClass,
            "perdedorClass": perdedorClass,
            "hp_act_p2": stats2["ca_health_act"],
            "cosmo_act_p1": stats1.get("ca_cosmo_act", 0),
            "cosmo_act_p2": stats2.get("ca_cosmo_act", 0)},
            "template_index": pick_tpl_index("victoria")
        })
    else:
        events.append({
            "type": "empate",
            "vars": { "hp_act_p1": stats1["ca_health_act"],
            "hp_act_p2": stats2["ca_health_act"],
                        "ganadorClass": ganadorClass,
            "perdedorClass": perdedorClass,
            "cosmo_act_p1": stats1.get("ca_cosmo_act", 0),
            "cosmo_act_p2": stats2.get("ca_cosmo_act", 0)},
            "template_index": pick_tpl_index("empate")
        })

    # Clamp de salud al cierre
    final_p1 = max(0, int(stats1["ca_health_act"]))
    final_p2 = max(0, int(stats2["ca_health_act"]))

    return {
        "events": events,
        "debug": debug,
        "final_stats": {
            "p1": {"nombre": p1["ca_name"], "salud_final": final_p1, "daño_total": dmg_total_p1},
            "p2": {"nombre": p2["ca_name"], "salud_final": final_p2, "daño_total": dmg_total_p2}
        },
        "pj1_img_principal": p1["ca_img_main"],
        "pj2_img_principal":p2["ca_img_main"],
        "ganador": ganador,
        "ganador_msg": ganador_text,
        "ganador_img": ganador_img,
        "perdedor": perdedor,
        "perdedor_msg":perdedor_text,
        "perdedor_img":perdedor_img,
        "motivo": motivo,
        "rng_seed_battle": battle_seed,
        "templates": {"version": "pack-v1"}  # ← ponle el hash/versión que uses

    }
