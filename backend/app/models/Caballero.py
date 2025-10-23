from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, BigInteger, DateTime, Boolean, ForeignKey, Text
from ..db import Base  # Base declarativa desde db.py

class Caballero(Base):
    __tablename__ = "Caballero"


    ca_key = Column(BigInteger, primary_key=True, index=True, nullable=False) #ID Del caballero
    ca_ac_key = Column(BigInteger, ForeignKey("Account.ac_key"), nullable=False) #Id del account al que pertenece
    ca_name = Column(String(30), nullable=False) #Nombre del caballero
    ca_level = Column(Integer, nullable=False, default=1) #Nivel del caballero
    ca_experience = Column(Integer, nullable=False, default=0) #Experiencia base del caballero
    ca_gold = Column(Integer, nullable=False, default=300) #Oro del caballero
    ca_hability = Column(Integer, nullable=False, default = 0) #Puntos de habilidad para canjear en entrenamiento.
    ca_health = Column(Integer, nullable=False, default=250) #Salud del caballero
    ca_health_act = Column(Integer, nullable=False, default=250) #Salud con la que arranca el caballero

    #Atributos para tirar mas rondas
    ca_velocity = Column(Integer, nullable=False, default=1) #Velocidad del caballero
    
    #Atributos para incremento de Daño:
    ca_power = Column(Integer, nullable=False, default=1) #Poder del caballero
    ca_knowledge = Column(Integer, nullable=False, default=1) #Conocimiento del caballero

    #Atributos para acertar golpes:
    ca_precision = Column(Integer, nullable=False, default=1) #Precisión del caballero
    #Atributos para esquivar golpes:
    ca_agility = Column(Integer, nullable=False, default=1) #Agilidad del caballero

    #Atributos para reducción de Daño:
    ca_resistance = Column(Integer, nullable=False, default=1) #Resistencia del caballero
    ca_psy_resistance = Column(Integer, nullable=False, default=1) #Resistencia psicológica del caballero

    #Atributos para uso de habilidades especiales
    ca_persistence = Column(Integer, nullable=False, default=1) #Persistencia del caballero, probabilidad de levantarce tras caer en combate
    ca_cosmo = Column(Integer, nullable=False, default=1) #Cosmo del caballero, consumible para usar habilidades especiales
    ca_cosmo_act = Column(Integer, nullable=False, default = 0) #Cosmo actual del caballero, para uso de habilidades
    ca_seventh_sense = Column(Integer, nullable=False, default=1) #Sexto sentido del caballero, porcentaje de incremento en estadisticas de combate
    ca_seventh_sense_act = Column(Integer, nullable = False, default=0) #Secto sentido actual del caballero, se incrementa al meditar.

    #Atributo para requisitos de honor/ranking
    ca_honor = Column(Integer, nullable=False, default=10) #El honor del caballero no se puede incrementar en update.
    
    #Atributos de bonus:
    ca_di_key = Column(Integer, ForeignKey("Divinidad.di_key"), nullable=False)#Divinidad elegida por el jugador.
    ca_zo_key = Column(Integer, ForeignKey("Zodiaco.zo_key"), nullable=False) #Zodiaco seleccionado por el jugador.

    #Atributos de WR:
    ca_win = Column(Integer, nullable=False, default=0) #Cantidad de victorias
    ca_loss = Column(Integer, nullable=False, default=0) #Cantidad de derrotas

    #Preferencias de combate
    ca_msg_win = Column(String(200), nullable=True, default="Ha sido un honor pelear contigo...Sin embargo, ¡Solo uno podía salir con la victoria!")
    ca_msg_loss = Column(String(200), nullable=True, default="La derrota es el mayor aprendizaje que puede ofrecerte la vida ¡La próxima será diferente!")
    ca_img_main = Column(String(5000), nullable=True)
    ca_img_win = Column(String(5000), nullable=True)
    ca_img_loss = Column(String(5000), nullable=True)

    #Atributos de status:
    ca_zon_key_act = Column(Integer, ForeignKey("Zonas.zon_key"), nullable=False, default=1) #Zona en la que se encuentra el caballero
    ca_status = Column(String(30), nullable=False, default="Ready") #Status de acciones del caballero
    ca_createdate = Column(DateTime, nullable=False, default=datetime.utcnow) #Fecha de Creación del caballero
    ca_lastlogin = Column(DateTime, nullable=True) #Último inicio de sesión del caballero
    ca_lastaction = Column(DateTime, nullable=True, default=datetime.utcnow) #Última acción ejecutada por el caballero
    ca_status_player = Column(Boolean, nullable=False, default=True) #Status del jugador, activo o inactivo.
    ca_comments = Column(Text, nullable=True) #Comentarios

    # 🔥 relaciones
    signo = relationship("Zodiaco", backref="caballeros")
    divinidad = relationship("Divinidad", backref="caballeros")
    zona = relationship("Zona", backref="caballeros")

