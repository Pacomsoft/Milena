from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    usuario: str

    class Config:
        orm_mode = True
