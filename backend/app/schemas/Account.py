from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

# Esquema base compartido
class AccountBase(BaseModel):
    ac_email: EmailStr
    ac_username: str
    ac_birthday: date
    ac_comments: Optional[str] = None
    ac_question_security: str
    ac_answer_sec: str


# Esquema para creación (entrada de usuario)
class AccountCreate(AccountBase):
    ac_password: str


# Esquema para actualizar (entrada opcional)
class AccountUpdate(BaseModel):
    ac_email: Optional[EmailStr] = None
    ac_username: Optional[str] = None
    ac_password: Optional[str] = None
    ac_birthday: Optional[date] = None
    ac_status: Optional[bool] = None
    ac_ban: Optional[bool] = None
    ac_comments: Optional[str] = None
    ac_amonestation: Optional[int] = None
    ac_question_security: Optional[str] = None
    ac_answer_sec: Optional[str] = None
    ac_lastlogin: Optional[datetime] = None


# Esquema de salida (lo que devuelve la API)
class AccountOut(AccountBase):
    ac_key: int
    ac_createdate: datetime
    ac_status: bool
    ac_ban: bool
    ac_amonestation: int
    ac_lastlogin: Optional[datetime] = None

    class Config:
        orm_mode = True
