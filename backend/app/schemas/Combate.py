# schemas/combate.py
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

# ==========
# BASE
# ==========
class CombateBase(BaseModel):
    # Identidad de participantes
    co_ca_key_attacker: int = Field(..., description="ID del atacante (Caballero.ca_key)", alias="id_attacker")
    co_ca_key_defender: int = Field(..., description="ID del defensor (Caballero.ca_key)", alias="id_defender")

    # Resultado
    co_winner: Optional[int] = Field(None, description="ID ganador (Caballero.ca_key)", alias="id_winner")
    co_loser: Optional[int] = Field(None, description="ID perdedor (Caballero.ca_key)", alias="id_loser")
    co_win_condition: Optional[str] = Field(None, description='Modo: "KO", "daño_acumulado", "timeout", etc.')
    co_round_ko: Optional[int] = Field(None, description="Ronda en que se decidió (si aplica)")

    # Estado / tiempo
    co_status: str = Field("Finished", description='Estado: "Pending"|"Ongoing"|"Finished"')
    co_startdate: Optional[datetime] = Field(None, description="Inicio del combate (UTC)")
    co_enddate: Optional[datetime] = Field(None, description="Fin del combate (UTC)")
    co_duration_ms: Optional[int] = Field(None, description="Duración estimada en milisegundos")

    # Snapshot de contexto (texto plano para no romper por cambios)
    attacker_deity: Optional[str] = Field(None, description="Deidad/afinidad del atacante en el momento")
    defender_deity: Optional[str] = Field(None, description="Deidad/afinidad del defensor en el momento")
    attacker_rank: Optional[str] = Field(None, description="Rango del atacante en el momento")
    defender_rank: Optional[str] = Field(None, description="Rango del defensor en el momento")

    # Rondas / iniciativa
    co_rounds_total: Optional[int] = Field(None, description="Rondas disputadas")
    attacker_initiative_wins: Optional[int] = Field(0, description="Veces que el atacante ganó iniciativa")
    defender_initiative_wins: Optional[int] = Field(0, description="Veces que el defensor ganó iniciativa")

    # Daños totales (globales)
    attacker_damage_total: Optional[int] = Field(0, description="Daño total infligido por el atacante")
    defender_damage_total: Optional[int] = Field(0, description="Daño total infligido por el defensor")

    # Daño por tipo (hoy: físico/cósmico)
    attacker_dmg_phys_total: Optional[int] = Field(0, description="Daño físico total (atacante)")
    attacker_dmg_cosm_total: Optional[int] = Field(0, description="Daño cósmico total (atacante)")
    defender_dmg_phys_total: Optional[int] = Field(0, description="Daño físico total (defensor)")
    defender_dmg_cosm_total: Optional[int] = Field(0, description="Daño cósmico total (defensor)")

    # Máximos por tipo
    attacker_max_hit_phys: Optional[int] = Field(0, description="Mayor golpe físico del atacante")
    attacker_max_hit_cosm: Optional[int] = Field(0, description="Mayor golpe cósmico del atacante")
    defender_max_hit_phys: Optional[int] = Field(0, description="Mayor golpe físico del defensor")
    defender_max_hit_cosm: Optional[int] = Field(0, description="Mayor golpe cósmico del defensor")

    # Conteos de eventos
    attacker_hits: Optional[int] = Field(0, description="Golpes acertados por el atacante")
    attacker_misses: Optional[int] = Field(0, description="Intentos fallidos del atacante")
    attacker_dodges: Optional[int] = Field(0, description="Esquivas realizadas por el atacante (cuando fue defensor)")
    attacker_counters: Optional[int] = Field(0, description="Contraataques ejecutados por el atacante")
    attacker_crits: Optional[int] = Field(0, description="Críticos del atacante")
    attacker_persistence: Optional[int] = Field(0, description="Veces que el atacante revivió/persistió")

    defender_hits: Optional[int] = Field(0, description="Golpes acertados por el defensor")
    defender_misses: Optional[int] = Field(0, description="Intentos fallidos del defensor")
    defender_dodges: Optional[int] = Field(0, description="Esquivas realizadas por el defensor")
    defender_counters: Optional[int] = Field(0, description="Contraataques ejecutados por el defensor")
    defender_crits: Optional[int] = Field(0, description="Críticos del defensor")
    defender_persistence: Optional[int] = Field(0, description="Veces que el defensor revivió/persistió")

    # Tasas / promedios
    attacker_hit_rate: Optional[float] = Field(None, description="hits/(hits+misses) del atacante")
    defender_hit_rate: Optional[float] = Field(None, description="hits/(hits+misses) del defensor")
    attacker_avg_dmg_hit: Optional[float] = Field(None, description="daño medio por golpe acertado (atacante)")
    defender_avg_dmg_hit: Optional[float] = Field(None, description="daño medio por golpe acertado (defensor)")

    # Highlights
    first_blood_ca_key: Optional[int] = Field(None, description="Quién conectó el primer daño (ca_key)")
    last_hit_ca_key: Optional[int] = Field(None, description="Quién dio el golpe final (ca_key)")
    attacker_longest_streak: Optional[int] = Field(0, description="Racha de aciertos más larga (atacante)")
    defender_longest_streak: Optional[int] = Field(0, description="Racha de aciertos más larga (defensor)")
    attacker_overkill: Optional[int] = Field(0, description="Daño excedente en el KO (atacante)")
    defender_overkill: Optional[int] = Field(0, description="Daño excedente en el KO (defensor)")

    # Versionado templates / RNG
    templates_version: Optional[str] = Field(None, description="Versión/hash del pack de mensajes")
    rng_seed_battle: Optional[int] = Field(None, description="Seed RNG de la batalla")
    battle_type: Optional[str] = Field(None, description='Tipo de batalla: "duelo", "torneo", "evento", etc.')
    battle_quest_id: Optional[int] = Field(None, description="ID de quest/evento si aplica")
    battle_npc_id: Optional[int] = Field(None, description="ID del NPC si aplica")
    battle_background: Optional[str] = Field(None, description="Nombre del background usado en UI")
    
    # Notas y payload
    co_comments: Optional[str] = Field(None, description="Comentarios adicionales")
    payload: Optional[Dict[str, Any]] = Field(
        None,
        description="Snapshot completo (participants, events con template_index y/o html_log, etc.)"
    )
    class Config:
        #orm_mode = True
        from_attributes=True
        populate_by_name  = True


# ==========
# CREATE (lo que tu backend insertará al guardar la pelea)
#  - Si expones públicamente este schema, puedes dejar la mayoría opcional
#    porque tu servicio de simulación es quien rellena métricas.
# ==========
class CombateCreate(CombateBase):
    """
    Para crear un registro de combate ya calculado.
    Requiere IDs de atacante/defensor y permite incluir métricas, contexto y payload.
    """
    pass


# ==========
# OUTPUT (lo que devuelves al cliente)
# ==========
class CombateOut(CombateBase):
    co_key: int = Field(..., description="ID del combate", alias="id_combat")
    co_createdate: datetime = Field(..., description="Fecha de creación (UTC)")

    class Config:
        #orm_mode = True
        from_attributes=True
        populate_by_name  = True
       
