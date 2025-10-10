# services/combate_aggregator.py
from typing import Dict, Any, Optional
from datetime import datetime

def _is_cosmic(tipo: Optional[str]) -> bool:
    if not tipo:
        return False
    t = tipo.lower()
    return ("cosm" in t) or ("psiq" in t) or ("psi" in t)

def _safe_div(n: int, d: int) -> Optional[float]:
    return None if d == 0 else (n / d)

def aggregate_from_result(
    p1_id: int,
    p2_id: int,
    p1_name: str,
    p2_name: str,
    resultado: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Lee resultado de tu motor (events + debug + final_stats) y retorna
    un dict con todas las columnas denormalizadas listas para crear Combate.
    p1 = "lado atacante" (co_ca_key_attacker), p2 = "lado defensor"
    """
    events = resultado.get("events") or []
    debug  = resultado.get("debug") or {}
    final_stats = resultado.get("final_stats") or {}
    ganador_name = resultado.get("ganador")
    perdedor_name = resultado.get("perdedor")
    motivo = resultado.get("motivo")
    rng_seed = resultado.get("rng_seed_battle")
    tpl_version = (resultado.get("templates") or {}).get("version")

    # Map nombre→id (solo p1/p2)
    def name_to_id(n: Optional[str]) -> Optional[int]:
        if n == p1_name: return p1_id
        if n == p2_name: return p2_id
        return None

    # ===== Acumuladores
    # Daños totales y por tipo
    att_total = def_total = 0
    att_phys = att_cosm = 0
    def_phys = def_cosm = 0
    # Máximos por tipo
    att_max_phys = att_max_cosm = 0
    def_max_phys = def_max_cosm = 0
    # Conteos
    att_hits = att_miss = att_dodge = att_counter = att_crits = att_persist = 0
    def_hits = def_miss = def_dodge = def_counter = def_crits = def_persist = 0
    # Rachas / highlights
    att_streak = def_streak = 0
    att_longest = def_longest = 0
    first_blood_id: Optional[int] = None
    last_hit_id: Optional[int] = None
    # Iniciativa / rondas
    att_init_wins = def_init_wins = 0
    rounds_total = 0
    round_ko: Optional[int] = None
    current_round: Optional[int] = None

    # ===== Iniciativa por ronda
    # Tu debug["probabilidades"] incluye {"ronda": r, "atacante": "p1"|"p2", ...}
    for pr in debug.get("probabilidades", []):
        r = int(pr.get("ronda", 0) or 0)
        rounds_total = max(rounds_total, r)
        atc = pr.get("atacante")
        if atc == "p1":
            att_init_wins += 1
        elif atc == "p2":
            def_init_wins += 1

    # ===== Recorrido de eventos
    # Tipos: round_start, ataque_hit, ataque_resistido, esquiva, contraataque, persistencia, muerte, victoria, empate
    for ev in events:
        etype = ev.get("type")
        if etype == "round_start":
            current_round = int(ev.get("ronda") or 0)
            rounds_total = max(rounds_total, current_round)
            continue

        vars_ = ev.get("vars") or {}
        dmg = int(vars_.get("dmg") or 0)
        tipo = vars_.get("tipo")
        atq_name = vars_.get("atacante")
        def_name = vars_.get("defensor")

        # Actor del daño (para first/last y rachas):
        # - ataque_hit: actor = atacante
        # - contraataque: actor = defensor
        actor_id = None
        if etype == "ataque_hit":
            actor_id = name_to_id(atq_name)
        elif etype == "contraataque":
            actor_id = name_to_id(def_name)

        if etype == "ataque_hit":
            if atq_name == p1_name:
                att_hits += 1
                att_total += dmg
                if _is_cosmic(tipo):
                    att_cosm += dmg; att_max_cosm = max(att_max_cosm, dmg)
                else:
                    att_phys += dmg; att_max_phys = max(att_max_phys, dmg)
                att_streak += 1; def_streak = 0
                att_longest = max(att_longest, att_streak)
            else:
                def_hits += 1
                def_total += dmg
                if _is_cosmic(tipo):
                    def_cosm += dmg; def_max_cosm = max(def_max_cosm, dmg)
                else:
                    def_phys += dmg; def_max_phys = max(def_max_phys, dmg)
                def_streak += 1; att_streak = 0
                def_longest = max(def_longest, def_streak)

            if dmg > 0 and first_blood_id is None:
                first_blood_id = actor_id
            if dmg > 0:
                last_hit_id = actor_id

        elif etype == "ataque_resistido":
            if atq_name == p1_name:
                att_miss += 1
            else:
                def_miss += 1
            att_streak = 0; def_streak = 0

        elif etype == "esquiva":
            # cuenta como esquiva del DEFENSOR (quién evitó el golpe)
            if def_name == p1_name:
                att_dodge += 1
            else:
                def_dodge += 1
            att_streak = 0; def_streak = 0

        elif etype == "contraataque":
            if def_name == p1_name:
                att_counter += 1
                att_hits += 1
                att_total += dmg
                if _is_cosmic(tipo):
                    att_cosm += dmg; att_max_cosm = max(att_max_cosm, dmg)
                else:
                    att_phys += dmg; att_max_phys = max(att_max_phys, dmg)
                att_streak += 1; def_streak = 0
                att_longest = max(att_longest, att_streak)
            else:
                def_counter += 1
                def_hits += 1
                def_total += dmg
                if _is_cosmic(tipo):
                    def_cosm += dmg; def_max_cosm = max(def_max_cosm, dmg)
                else:
                    def_phys += dmg; def_max_phys = max(def_max_phys, dmg)
                def_streak += 1; att_streak = 0
                def_longest = max(def_longest, def_streak)

            if dmg > 0 and first_blood_id is None:
                first_blood_id = actor_id
            if dmg > 0:
                last_hit_id = actor_id

        elif etype == "persistencia":
            if def_name == p1_name:
                att_persist += 1
            else:
                def_persist += 1

        elif etype == "muerte":
            # marca ronda del KO si la conocemos
            if round_ko is None:
                round_ko = current_round

        # Críticos (si más adelante marcas crit o mult en vars)
        if vars_.get("critico") is True or (isinstance(vars_.get("mult"), (int, float)) and vars_["mult"] >= 1.5):
            if actor_id == p1_id:
                att_crits += 1
            elif actor_id == p2_id:
                def_crits += 1

    # Totales ataque/intentos
    att_attempts = att_hits + att_miss
    def_attempts = def_hits + def_miss

    # Winner/loser ids
    co_winner = p1_id if ganador_name == p1_name else (p2_id if ganador_name == p2_name else None)
    co_loser  = p1_id if perdedor_name == p1_name else (p2_id if perdedor_name == p2_name else None)

    # Armamos el dict para el modelo Combate
    data = dict(
        # Relaciones
        co_ca_key_attacker=p1_id,
        co_ca_key_defender=p2_id,

        # Resultado
        co_winner=co_winner,
        co_loser=co_loser,
        co_win_condition=motivo or None,
        co_round_ko=round_ko,

        # Estado/tiempo (puedes setear start/end reales afuera)
        co_status="Finished",
        co_startdate=datetime.utcnow(),
        co_enddate=datetime.utcnow(),
        co_duration_ms=None,

        # Rondas / iniciativa
        co_rounds_total=rounds_total or None,
        attacker_initiative_wins=att_init_wins,
        defender_initiative_wins=def_init_wins,

        # Daños totales
        attacker_damage_total=att_total,
        defender_damage_total=def_total,

        # Daño por tipo
        attacker_dmg_phys_total=att_phys,
        attacker_dmg_cosm_total=att_cosm,
        defender_dmg_phys_total=def_phys,
        defender_dmg_cosm_total=def_cosm,

        # Máximos
        attacker_max_hit_phys=att_max_phys,
        attacker_max_hit_cosm=att_max_cosm,
        defender_max_hit_phys=def_max_phys,
        defender_max_hit_cosm=def_max_cosm,

        # Conteos
        attacker_hits=att_hits,
        attacker_misses=att_miss,
        attacker_dodges=att_dodge,
        attacker_counters=att_counter,
        attacker_crits=att_crits,
        attacker_persistence=att_persist,

        defender_hits=def_hits,
        defender_misses=def_miss,
        defender_dodges=def_dodge,
        defender_counters=def_counter,
        defender_crits=def_crits,
        defender_persistence=def_persist,

        # Tasas / promedios
        attacker_hit_rate=_safe_div(att_hits, att_attempts) if att_attempts else None,
        defender_hit_rate=_safe_div(def_hits, def_attempts) if def_attempts else None,
        attacker_avg_dmg_hit=_safe_div(att_total, att_hits) if att_hits else None,
        defender_avg_dmg_hit=_safe_div(def_total, def_hits) if def_hits else None,

        # Highlights
        first_blood_ca_key=first_blood_id,
        last_hit_ca_key=last_hit_id,
        attacker_longest_streak=att_longest,
        defender_longest_streak=def_longest,
        attacker_overkill=0,  # si luego añades hp_pre/hp_post por evento, puedes calcularlo
        defender_overkill=0,

        # Versionado/RNG
        templates_version=tpl_version,
        rng_seed_battle=rng_seed,
        co_createdate=datetime.utcnow()
    )

    return data


