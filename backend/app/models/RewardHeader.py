from datetime import datetime
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, Boolean, ForeignKey, Text
from ..db import Base  # Base declarativa desde db.py

class RewardHeader(Base):
    __tablename__ = "Reward_Header"
    
    re_key = Column(Integer, primary_key=True, index=True)
    re_name = Column(String(100), nullable=False)         # Ej: Recompensa Exploración Base
    re_type = Column(String(50), nullable=False)           # 'Exploración', 'Pelea', 'Misión', 'Evento'
    re_formula = Column(String(200), nullable=True)        # Ej: 'base_oro * nivel * 1.2'
    re_description = Column(String(300), nullable=True)
    re_active = Column(Boolean, default=True)
    re_created_date = Column(DateTime, default=datetime.utcnow)
