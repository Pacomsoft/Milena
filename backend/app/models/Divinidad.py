from datetime import datetime
from sqlalchemy import Column, String,  DateTime, Boolean, Integer, Text
from ..db import Base

class Divinidad(Base):
    __tablename__ = "Divinidad"
    di_key = Column(Integer, primary_key=True, index=True, nullable=False) #ID De la divinidad
    di_name = Column(String(30), nullable=False) #Nombre de la divinidad
    di_description = Column(Text, nullable=True) #Descripción de la divinidad
    di_createdate = Column(DateTime, nullable=False, default=datetime.utcnow)
    di_status = Column(Boolean, nullable=False, default=True)
    di_comments = Column(Text, nullable=True)
    di_lastupdate = Column(DateTime, nullable=True, default=datetime.utcnow)
    di_icon = Column(Text, nullable=True) #Icono de la divinidad

