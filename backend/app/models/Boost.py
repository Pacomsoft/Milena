from sqlalchemy import Column, Integer, String, BigInteger, DateTime, Text
from ..db import Base
from datetime import datetime

class Boost(Base):
    __tablename__ = "Boost"
    bo_key = Column(Integer, primary_key = True, index=True, nullable=False) #LLave primaria del boost
    bo_name = Column(String(50), nullable=False)
    bo_description = Column(Text, nullable=False)
    bo_type = Column(String(50), nullable=False) #Tipo del boost, si es por Deidad, por Signo Zodiacal, por Armadura..etc
    bo_origin = Column(BigInteger, nullable=False) #Origen del boost, key de la deidad, signo o armadura, etc
    bo_unit = Column(String(10), nullable = False) #Unidad, si son numeros enteros o porcentaje
    bo_stat = Column(String(20), nullable=False) #Stat que será afectado, ej ca_velocity, ca_presicion
    bo_quantity = Column(Integer, nullable=False) #Cantidad de incremento 
    bo_lastupdated = Column(DateTime, nullable=False, default=datetime.utcnow)
    bo_createdate = Column(DateTime, nullable=False, default=datetime.utcnow)

    
