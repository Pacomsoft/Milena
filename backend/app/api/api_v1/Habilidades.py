from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas import Habilidades as HabilidadesSchema
from app.db import get_db
from app.operations.entrenar import calcular_costo_stat
import random, math
from pydantic import BaseModel

router = APIRouter()

@router.post("/GET_Costo")
def get_divinidades(req: HabilidadesSchema.NivelStat):
    costo = calcular_costo_stat(req.nivel_stat)
    return {'costo':costo}

def sigmoid_probability(diff, s=10.0):
    """Probabilidad de que el atacante gane la suerte según la diferencia de stats"""
    return 1.0 / (1.0 + math.exp(-diff / s))
def sample_multiplier(p_win, dificultad=2.0):
    # random base
    x = random.random()
    
    # sesgo según suerte, limitado para que no explote
    sesgo = 0.5 + (p_win - 0.5) * 0.5  # 0.5 a 0.75 por ejemplo

    # aplicamos dificultad: valores altos menos probables
    biased = x ** dificultad

    # escalamos entre 1.5 y 2.0
    mult = 1.5 + biased * 0.5 * sesgo
    return mult

def calcular_daño(fuerza, resistencia, s=10.0, dificultad=2.0):
    diff = fuerza - resistencia
    p_atq = sigmoid_probability(diff, s)  # probabilidad de ganar la suerte
    r = random.random()
    atacante_gana = (r <= p_atq)

    if atacante_gana:
        mult = sample_multiplier(p_atq, dificultad)
        fuerza_total = fuerza * mult
        resistencia_total = resistencia
    else:
        mult = sample_multiplier(1.0 - p_atq, dificultad)
        fuerza_total = fuerza
        resistencia_total = resistencia * mult

    # Daño aleatorio entre 1 y (FuerzaTotal - ResistenciaTotal)
    if fuerza_total <= resistencia_total:
        daño = 0
    else:
        daño_base = random.uniform(1, fuerza_total - resistencia_total)
        daño = max(0, round(daño_base), 1)

    return {
        "daño": daño,
        "atacante_gana_suerte": atacante_gana,
        "probabilidad_atacante": round(p_atq, 4),
        "multiplicador": round(mult, 3),
        "fuerza_total": round(fuerza_total, 2),
        "resistencia_total": round(resistencia_total, 2)
    }

# Función genérica para daño
def calcular_dano_generico(ofensiva, defensiva, s=10.0, dificultad=2.0):
    diff = ofensiva - defensiva
    p_atq = sigmoid_probability(diff, s)  # probabilidad de ganar la suerte
    r = random.random()
    atacante_gana = (r <= p_atq)

    if atacante_gana:
        mult = sample_multiplier(p_atq, dificultad)
        ofensiva_total = ofensiva * mult
        defensiva_total = defensiva
    else:
        mult = sample_multiplier(1.0 - p_atq, dificultad)
        ofensiva_total = ofensiva
        defensiva_total = defensiva * mult

    if ofensiva_total <= defensiva_total:
        dano = 0
    else:
        dano_base = random.uniform(1, ofensiva_total - defensiva_total)
        dano = max(0, round(dano_base), 1)

    return {
        "daño": dano,
        "atacante_gana_suerte": atacante_gana,
        "probabilidad_atacante": round(p_atq, 4),
        "multiplicador": round(mult, 3),
        "ofensiva_total": round(ofensiva_total, 2),
        "defensiva_total": round(defensiva_total, 2)
    }
# Endpoint POST
# Modelo de entrada
class StatsInput(BaseModel):
    tipo: str  # "fisico" o "cosmico"
    fuerza: float = 0
    resistencia: float = 0
    sabiduria: float = 0
    resistencia_psiquica: float = 0

    
# Endpoint unificado
@router.post("/calcular_dano_post")
def endpoint_calcular_dano_post(input: StatsInput):
    try:
        if input.tipo.lower() == "fisico":
            resultado = calcular_dano_generico(input.fuerza, input.resistencia)
        elif input.tipo.lower() == "cosmico":
            resultado = calcular_dano_generico(input.sabiduria, input.resistencia_psiquica)
        else:
            return {"error": "Tipo inválido. Usa 'fisico' o 'cosmico'."}

        return {
            "tipo": input.tipo,
            **resultado
        }

    except Exception as e:
        return {"error": str(e)}