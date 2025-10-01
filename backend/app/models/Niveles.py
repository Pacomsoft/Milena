from datetime import datetime
from sqlalchemy import  Column, Integer, String, Boolean
from  ..db import Base

class Niveles(Base):
    __tablename__ = "Niveles"
    ni_id = Column(Integer, primary_key = True, index=True, nullable=False) #Identificador del nivel
    ni_level = Column(Integer, nullable=False)
    ni_exp_necessary = Column(Integer, nullable=False)
    ni_exp_accumulated = Column(Integer, nullable=False)
    ni_oro_reward = Column(Integer, nullable=False)
    ni_habilidad = Column(Integer, nullable=True)
    ni_other_reward = Column(Integer, nullable=True)
    ni_createddate = Column(Integer, nullable=False, default=datetime.utcnow)
    


