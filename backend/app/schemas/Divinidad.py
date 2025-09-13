from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional

class DivinidadBase(BaseModel):
    di_name: str
    di_description: str
    di_icon: str

class DivinidadUpdate(DivinidadBase):
    di_status: Optional[bool] = None
    di_comments: Optional[str] = None

class DivinidadCreate(DivinidadBase):
    di_status: bool = True
    di_createdate: datetime = Field(default_factory=datetime.utcnow)
    di_lastupdate: Optional[datetime] = Field(default_factory=datetime.utcnow)

class DivinidadOut(DivinidadBase):
    di_key: int
    di_createdate:datetime
    di_status: bool
    di_comments: Optional[str]
    di_lastupdate: Optional[datetime]

    class Config:
        orm_mode = True
