from pydantic import BaseModel

class UserBase(BaseModel):
    usuario: str

class UserLogin(UserBase):
    contrasena: str  # para login

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
