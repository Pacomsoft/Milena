from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from ..db import Base

class Zodiaco(Base):
    __tablename__ = "Zodiaco"
    zo_key = Column(Integer, primary_key=True,  nullable=False, index=True)
    zo_name = Column(String(40), nullable=False)
    zo_description = Column(Text, nullable = False)
    zo_image = Column(Text, nullable = False)
    zo_createdate = Column(DateTime, nullable = False, default=datetime.utcnow  )
    