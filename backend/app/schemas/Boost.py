from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BoostBase(BaseModel):
    bo_name: str
    bo_description: str
    bo_type: str
    bo_origin: int
    bo_unit: str
    bo_stat: str
    bo_quantity: int
    
class BoostUpdate(BaseModel):
    bo_name: Optional[str] = None
    bo_description: Optional[str] = None
    bo_type: Optional[str] = None
    bo_origin: Optional[int] = None
    bo_unit: Optional[str] = None
    bo_stat: Optional[str] = None
    bo_quantity: Optional[int] = None

class BoostCreate(BaseModel):
    bo_name: str
    bo_description: str
    bo_type: str
    bo_origin: int
    bo_unit: str
    bo_stat: str
    bo_quantity: int

class BoostOut(BoostBase):
    bo_key: int
    bo_lastupdated: datetime
    bo_createdate: datetime
    class Config:
        orm_mode = True
