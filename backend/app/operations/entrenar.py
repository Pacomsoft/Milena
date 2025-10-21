import random, math
from typing import Dict
from pydantic import BaseModel


# operations/operations.py

# Parámetros configurables de la fórmula de costos
BASE_COST = 40            # costo mínimo
GROWTH_FACTOR = 7         # factor de crecimiento lineal
CURVE_EXPONENT = 0.7      # forma de la curva

def calcular_costo_stat(nivel_stat: int) -> int:
    """
    Calcula el costo para subir un stat según el nivel actual.
    """
    return int(BASE_COST + GROWTH_FACTOR * (nivel_stat ** CURVE_EXPONENT))

def sigmoid_probability(diff, s=10.0):
    return 1.0 / (1.0 + math.exp(-diff / s))

def sample_multiplier(p_win, dificultad=2.0):
    x = random.random()
    sesgo = 0.5 + (p_win - 0.5) * 0.5
    biased = x ** dificultad
    return 1.5 + biased * 0.5 * sesgo

def calcular_dano(ofensiva, defensiva, s=10.0, dificultad=2.0):
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
    else:
        return max(1, round(random.uniform(1, ofensiva_total - defensiva_total)))

# =========================================
# Modificadores de stats
# =========================================
def aplicar_modificadores(s: Dict, boosts):
    s = s.copy()

    #Asigna el boosts por deidad:
    print(boosts)
    #Asigna el boost por signo
    print(boosts)
    # Fuerza buffea resistencias
    s["ca_resistance"] += s["ca_power"] * 0.10
    s["ca_psy_resistance"] += s["ca_power"] * 0.10

    # Sabiduría buffea persistencia
    s["ca_persistence"] += s["ca_knowledge"] * 0.10

    # Precisión buffea fuerza y sabiduría
    s["ca_power"] += s["ca_precision"] * 0.10
    s["ca_knowledge"] += s["ca_precision"] * 0.10

    # Agilidad buffea velocidad
    s["ca_velocity"] += s["ca_agility"] * 0.10

    # Resistencia y psíquica buffean cosmo
    s["ca_cosmo_act"] += s["ca_resistance"] * 0.10
    s["ca_cosmo_act"] += s["ca_psy_resistance"] * 0.10

    #Séptimo sentido
    if s["ca_seventh_sense_act"] > 0:
        fac_seventh_sense=  (s["ca_seventh_sense_act"] * 0.25)/100
        for key in ["ca_velocity","ca_power","ca_knowledge","ca_precision","ca_agility",
                    "ca_resistance","ca_psy_resistance","ca_persistence","ca_cosmo"]:
            s[key] *= 1+fac_seventh_sense


    


    return s

def ganador_iniciativa(v1, v2, s=10.0):
    diff = v1 - v2
    p1_win = sigmoid_probability(diff, s)
    return random.random() <= p1_win

def combateOLD(p1: Dict, p2: Dict, p1_boosts, p2_boosts, rondas=5):
    log = []
    stats1 = aplicar_modificadores(p1, p1_boosts)
    stats2 = aplicar_modificadores(p2, p2_boosts)

    for r in range(1, rondas+1):
        log.append(f"\n--- Ronda {r} ---")

        # Determinar quién ataca esta ronda
        if ganador_iniciativa(stats1["ca_velocity"], stats2["ca_velocity"]):
            atacante, defensor = stats1, stats2
            nombre_atq, nombre_def = p1["ca_name"], p2["ca_name"]
        else:
            atacante, defensor = stats2, stats1
            nombre_atq, nombre_def = p2["ca_name"], p1["ca_name"]

        # Precisión vs Agilidad
        p_hit = atacante["ca_precision"] / (atacante["ca_precision"] + defensor["ca_agility"] + 1)

        if random.random() > p_hit:
            log.append(f"{nombre_atq} intenta atacar pero {nombre_def} logra esquivar.")
            # Contraataque
            if random.random() < 0.25:
                dmg = calcular_dano(defensor["ca_power"], atacante["ca_resistance"])
                atacante["ca_health_act"] -= dmg
                log.append(f"⚡ {nombre_def} contraataca y hace {dmg} de daño a {nombre_atq}!")
        else:
            # Decide tipo de ataque
            if random.random() < 0.5:
                dmg = calcular_dano(atacante["ca_power"], defensor["ca_resistance"])
                tipo = "físico"
            else:
                dmg = calcular_dano(atacante["ca_knowledge"], defensor["ca_psy_resistance"])
                tipo = "cósmico"

            defensor["ca_health_act"] -= dmg
            if dmg > 0:
                log.append(f"{nombre_atq} lanza un ataque {tipo} y {nombre_def} recibe {dmg} de daño!")
            else:
                log.append(f"{nombre_atq} lanza un ataque {tipo} pero {nombre_def} lo resiste completamente!")

            # Persistencia (revivir)
            if defensor["ca_health_act"] <= 0:
                pers = defensor["ca_persistence"]
                chance_revive = 0.75 * (pers/100)
                if random.random() < chance_revive:
                    defensor["ca_health_act"] = int(defensor["ca_health"] * 0.25)
                    log.append(f"🔥 {nombre_def} se levanta gracias a su persistencia!")
                else:
                    log.append(f"💀 {nombre_def} ha caído!")
                    break  # ya no sigue más esta ronda

    return log, stats1, stats2