from datetime import datetime
from sqlalchemy import Column, Integer, String, BigInteger, Date, DateTime, Boolean
from ..db import Base  # Base declarativa desde db.py

class Account(Base):
    __tablename__ = "Account"

    ac_key = Column(BigInteger, primary_key=True, index=True, nullable=False)
    ac_email = Column(String(40), unique=True, nullable=False)
    ac_username = Column(String(30), unique=True, nullable=False)
    ac_password = Column(String(128), nullable=False)
    ac_birthday = Column(Date, nullable=False)
    ac_createdate = Column(DateTime, nullable=False, default=datetime.utcnow)
    ac_token = Column(String(128), nullable=True)
    ac_status = Column(Boolean, nullable=False, default=True)
    ac_ban = Column(Boolean, nullable=False, default=False)
    ac_comments = Column(String(255), nullable=True)
    ac_amonestation = Column(Integer, nullable= True, default=0)
    ac_question_security = Column(String(255), nullable=False)
    ac_answer_sec = Column(String(255), nullable=False)
    ac_lastlogin = Column(DateTime, nullable=True)
    

