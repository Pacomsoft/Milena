from datetime import date, datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from ..db import Base

class Zona(Base):
    __tablename__ = "Zonas"

    zon_key = Column(Integer, primary_key=True, nullable=False, index=True)
    zon_name = Column(String(30), nullable=False)
    zon_description = Column(Text, nullable=False)
    zon_minlevel = Column(Integer, nullable=False, default=1)
    zon_req_prem = Column(Boolean, nullable=False, default = False)
    zon_status = Column(Boolean, nullable=False, default = True)
    zon_image = Column(Text, nullable=True, default = "isla_entrenamient.png")
    zon_createdate = Column(DateTime, nullable=False, default = datetime.utcnow)
    zon_lastupdated = Column(DateTime, nullable=False, default = datetime.utcnow)
