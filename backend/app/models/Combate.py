from datetime import datetime
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, Boolean, ForeignKey, Text, JSON, Float
from ..db import Base  # Base declarativa desde db.py



class Combate(Base):
    __tablename__ = "Combate"

    # Identidad / relaciones
    co_key                  = Column(BigInteger, primary_key=True, index=True, nullable=False, autoincrement=True)  # ID del combate
    co_ca_key_attacker      = Column(BigInteger, ForeignKey("Caballero.ca_key"), nullable=False)  # Participante A (referencia)
    co_ca_key_defender      = Column(BigInteger,  nullable=False)  # Puede ser un caballero o NPC. El tipo lo define battle_type.

    # Resultado
    co_winner               = Column(BigInteger, ForeignKey("Caballero.ca_key"), nullable=True)
    co_loser                = Column(BigInteger, ForeignKey("Caballero.ca_key"), nullable=True)
    co_win_condition        = Column(String(20), nullable=True)  # "KO", "daño_acumulado", "timeout", etc.
    co_round_ko             = Column(Integer, nullable=True)     # ronda en que se decidió (si aplica)

    # Estado / tiempo
    co_status               = Column(String(30), nullable=False, default="Finished")  # Pending, Ongoing, Finished
    co_createdate           = Column(DateTime, nullable=False, default=datetime.utcnow) #Falta de enviar
    co_startdate            = Column(DateTime, nullable=True)
    co_enddate              = Column(DateTime, nullable=True)
    co_duration_ms          = Column(Integer, nullable=True)     # duración total estimada/en ms

    # Snapshot de “contexto” (valores textuales para no romper por cambios futuros)
    attacker_deity          = Column(Integer, nullable=True)  # deidad o afinidad en el momento
    defender_deity          = Column(Integer, nullable=True)
    attacker_rank           = Column(Integer, nullable=True)  # rango/categoría al momento
    defender_rank           = Column(Integer, nullable=True)

    # Rondas / iniciativa
    co_rounds_total         = Column(Integer, nullable=True)
    attacker_initiative_wins= Column(Integer, nullable=True, default=0)
    defender_initiative_wins= Column(Integer, nullable=True, default=0)

    # Daños totales (globales)
    attacker_damage_total   = Column(Integer, nullable=True, default=0)
    defender_damage_total   = Column(Integer, nullable=True, default=0)

    # Daño por tipo (extensible; hoy físico/cósmico)
    attacker_dmg_phys_total = Column(Integer, nullable=True, default=0)
    attacker_dmg_cosm_total = Column(Integer, nullable=True, default=0)
    defender_dmg_phys_total = Column(Integer, nullable=True, default=0)
    defender_dmg_cosm_total = Column(Integer, nullable=True, default=0)

    # Máximos por tipo
    attacker_max_hit_phys   = Column(Integer, nullable=True, default=0)
    attacker_max_hit_cosm   = Column(Integer, nullable=True, default=0)
    defender_max_hit_phys   = Column(Integer, nullable=True, default=0)
    defender_max_hit_cosm   = Column(Integer, nullable=True, default=0)

    # Conteos de eventos
    attacker_hits           = Column(Integer, nullable=True, default=0)
    attacker_misses         = Column(Integer, nullable=True, default=0)
    attacker_dodges         = Column(Integer, nullable=True, default=0)   # veces que ESQUIVÓ (como defensor)
    attacker_counters       = Column(Integer, nullable=True, default=0)
    attacker_crits          = Column(Integer, nullable=True, default=0)
    attacker_persistence    = Column(Integer, nullable=True, default=0)   # veces que revivió/se levantó

    defender_hits           = Column(Integer, nullable=True, default=0)
    defender_misses         = Column(Integer, nullable=True, default=0)
    defender_dodges         = Column(Integer, nullable=True, default=0)
    defender_counters       = Column(Integer, nullable=True, default=0)
    defender_crits          = Column(Integer, nullable=True, default=0)
    defender_persistence    = Column(Integer, nullable=True, default=0)

    # Tasas / promedios útiles de dashboard
    attacker_hit_rate       = Column(Float, nullable=True)  # hits / (hits+misses)
    defender_hit_rate       = Column(Float, nullable=True)
    attacker_avg_dmg_hit    = Column(Float, nullable=True)  # daño medio por golpe acertado
    defender_avg_dmg_hit    = Column(Float, nullable=True)

    # “Highlights”
    first_blood_ca_key      = Column(BigInteger, nullable=True)  # quién conectó el primer daño
    last_hit_ca_key         = Column(BigInteger, nullable=True)  # quién dio el golpe final
    attacker_longest_streak = Column(Integer, nullable=True, default=0)  # racha de aciertos
    defender_longest_streak = Column(Integer, nullable=True, default=0)
    attacker_overkill       = Column(Integer, nullable=True, default=0)  # daño que sobró al KO (si clamp a 0)
    defender_overkill       = Column(Integer, nullable=True, default=0)

    # Template/versionado y RNG
    templates_version       = Column(String(16), nullable=True)  # hash/versión del pack de mensajes
    rng_seed_battle         = Column(BigInteger, nullable=True)
    battle_type            = Column(String(30), nullable=True)  # "duelo", "torneo", "evento", etc.
    battle_quest_id       = Column(Integer, nullable=True)  # si es parte de una quest/evento especial
    battle_npc_id         = Column(BigInteger, nullable=True)  # si es contra NPC
    battle_background     = Column(String(50), nullable=True)  # nombre del background usado en UI
    # Notas y payload
    co_comments             = Column(Text, nullable=True)
    payload                 = Column(JSON, nullable=True)  # snapshot completo (participants, events, html_log opcional)


