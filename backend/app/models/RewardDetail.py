from datetime import datetime
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, Boolean, ForeignKey, Float
from ..db import Base  # Base declarativa desde db.py

class RewardDetail(Base):
    __tablename__ = "Reward_Detail"

    rd_key = Column(Integer, primary_key=True, index=True)
    rd_re_key = Column(Integer, ForeignKey("Reward_Header.re_key"), nullable=False)
    rd_type = Column(String(50), nullable=False)      # "oro", "exp", "item", "armadura", "habilidad"
    rd_ref_id = Column(Integer, nullable=True)        # FK al ítem si aplica
    rd_base_value = Column(Float, nullable=False)     # Valor base (ej. 10 oro)
    rd_multiplier_per_level = Column(Float, default=0)  # Cuánto crece por nivel
    rd_probability = Column(Float, default=1.0)       # 1.0 = garantizado; 0.2 = 20% probabilidad
    rd_min_value = Column(Float, nullable=True)       # para rango aleatorio
    rd_max_value = Column(Float, nullable=True)
