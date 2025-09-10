from sqlalchemy import Column, Integer, String, BigInteger, tinyint
from ..db import Base  # Base declarativa desde db.py

class User(Base):
    __tablename__ = "usuario"

    id = Column(BigInteger, primary_key=True, index=True)
    usuario = Column(String(64), unique=True, index=True, nullable=False)    
    # Temporal: contraseña en texto plano (para usuarios existentes)
    contrasena = Column(String(128), nullable=False)
    gm = Column(String(1), )
    correo = Column(String(128), nullable=False)
    ip = Column(String(16), nullable=True )
    signo = Column(tinyint, nullable=False )
    imagen = Column(String(128), nullable=True)
    fechault = Column(BigInteger, nullable=True)
    fechavida = Column(BigInteger, nullable=True)
    fechacosmo = Column(BigInteger, nullable=True)
    fechaini = Column(BigInteger, nullable=True)
    

    # Futura: password hasheada
    # hashed_password = Column(String(128), nullable=False)
