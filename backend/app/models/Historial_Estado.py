from datetime import datetime
from sqlalchemy import Column, String,  DateTime, Boolean, Integer, ForeignKey, Text, BigInteger
from ..db import Base

class HistorialEstado(Base):
    __tablename__ = "Historial_Estado"

    hi_key = Column(Integer, primary_key=True, index=True, nullable=False)
    hi_ca_key = Column(BigInteger, ForeignKey("Caballero.ca_key"), nullable=False)
    hi_es_key = Column(Integer, ForeignKey("Estados.es_key"), nullable=False)
    hi_zon_key = Column(Integer, ForeignKey("Zonas.zon_key"), nullable=True)  
    hi_start_time = Column(DateTime, nullable=False, default=datetime.utcnow)
    hi_end_time = Column(DateTime, nullable=False)
    hi_active = Column(Boolean, default=True)
    hi_source = Column(String(50), nullable=True)  # “Combate”, “Exploración”, “Viaje”, “Misión”
    hi_result = Column(String(100), nullable=True)  # “Victoria”, “Derrota”, “Cancelado”, “Completado”
    hi_duration_min = Column(Integer, nullable=True)  # duracion total (útil para exploraciones largas)
    hi_re_key = Column(Integer, nullable=True)  # oro, exp, items, etc
    hi_notes = Column(String(300), nullable=True)  # texto descriptivo, libre
    hi_last_updated_date = Column(DateTime, nullable=False, default=datetime.utcnow)