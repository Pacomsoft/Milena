from datetime import datetime
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, Boolean, ForeignKey, Text
from ..db import Base  # Base declarativa desde db.py

class RewardSource(Base):
    __tablename__ = "Reward_Source"

    rs_key = Column(Integer, primary_key=True, index=True)
    rs_source_type = Column(String(50), nullable=False)   # 'Exploración', 'Pelea', 'Misión', 'Evento'
    rs_source_ref = Column(Integer, nullable=True)        # id_mision, id_evento, etc.
    rs_re_key = Column(Integer, ForeignKey("Reward_Header.re_key"), nullable=False)
