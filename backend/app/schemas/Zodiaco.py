from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

#Esquema compartido
class ZodiacoBase(BaseModel):
    zo_name: str
    zo_description: str
    zo_image: str

class ZodiacoOutput(ZodiacoBase):
    zo_key:int
    zo_createdate:datetime

    class Config:
        orm_mode = True
        