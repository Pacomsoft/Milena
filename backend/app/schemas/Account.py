from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from typing import Optional

# Esquema base compartido
class AccountBase(BaseModel):
    ac_email: EmailStr = Field(..., alias='correo')
    ac_username: str = Field(..., alias='username')
    ac_birthday: date = Field(..., alias='nacimiento')
    ac_comments: Optional[str] = Field(..., alias='comentarios')
    ac_question_security: str = Field(..., alias='pregunta')
    ac_answer_sec: str = Field(..., alias='respuesta')


# Esquema para creación (entrada de usuario)
class AccountCreate(AccountBase):
    ac_password: str = Field(..., alias='contrasena')


# Esquema para actualizar (entrada opcional)
class AccountUpdate(BaseModel):
    ac_email: Optional[EmailStr] = Field(..., alias='correo')
    ac_username: Optional[str] = Field(..., alias='username')
    ac_password: Optional[str] = Field(..., alias='contrasena')
    ac_birthday: Optional[date] = Field(..., alias='nacimiento')
    ac_status: Optional[bool] = Field(..., alias='estado')
    ac_ban: Optional[bool] = Field(..., alias='ban')
    ac_comments: Optional[str] = Field(..., alias='comentarios')
    ac_amonestation: Optional[int] = Field(..., alias='amonestacion')
    ac_question_security: Optional[str] = Field(...,alias= 'pregunta')
    ac_answer_sec: Optional[str] = Field(..., alias='respuesta')
    ac_lastlogin: Optional[datetime] = Field(..., alias='ultacceso')


# Esquema de salida (lo que devuelve la API)
class AccountOut(AccountBase):
    ac_key: int = Field(..., alias='id')
    ac_createdate: datetime = Field(..., alias='fechacreacion')
    ac_status: bool = Field(..., alias='estado')
    ac_ban: bool = Field(..., alias='ban')
    ac_amonestation: int = Field(..., alias='amonestacion')
    ac_lastlogin: Optional[datetime] = Field(..., alias='ultacceso')

    class Config:
        from_attributes=True
        populate_by_name  = True

