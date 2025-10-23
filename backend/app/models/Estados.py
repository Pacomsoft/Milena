from datetime import datetime
from sqlalchemy import Column, String,  DateTime, Boolean, Integer, Text
from ..db import Base


class Estados(Base):
    __tablename__ = "Estados"
    es_key = Column(Integer, primary_key=True, index=True, nullable=False)
    es_name = Column(String(50), nullable=False)
    es_description = Column(String(500), nullable=False)
    es_type = Column(String(50), nullable=False)
    es_default_time = Column(Integer, nullable=False)
    es_premium_time = Column(Integer, nullable=False)
    es_last_updated_date = Column(DateTime, nullable=False, default = datetime.utcnow)
