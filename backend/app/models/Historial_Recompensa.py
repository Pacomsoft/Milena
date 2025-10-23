from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from ..db import Base  # Base declarativa desde db.py

class HistorialRecompensa(Base):
    __tablename__ = "Historial_Recompensa"

    hr_key = Column(Integer, primary_key=True, index=True)
    hr_hi_key = Column(Integer, ForeignKey("Historial_Estado.hi_key"), nullable=False)
    hr_re_key = Column(Integer, ForeignKey("Reward_Header.re_key"), nullable=True)
    hr_type = Column(String(50), nullable=False)
    hr_ref_id = Column(Integer, nullable=True)
    hr_quantity = Column(Float, nullable=False, default=0)
    hr_rarity = Column(String(30), nullable=True)
    hr_obtained_at = Column(DateTime, default=datetime.utcnow)
