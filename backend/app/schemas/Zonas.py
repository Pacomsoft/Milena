from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ZonasBase(BaseModel):
    zon_name: str
    zon_description: str
    zon_minlevel: int = 1
    zon_req_prem:bool = False
    zon_status: bool = True
    zon_image: str = "isla_entrenamiento.png"

class ZonasUpdate(BaseModel):
    zon_name: Optional[str] = None
    zon_description: Optional[str] = None
    zon_minlevel: Optional[int] = None
    zon_req_prem: Optional[bool] = None
    zon_status: Optional[bool] = None
    zon_image: Optional[str] = None
    zon_lastupdated: Optional[datetime] = None  # opcional, se puede setear manualmente

class ZonasOutput(ZonasBase):
    zon_key: int
    zon_createdate: datetime
    zon_lastupdated: datetime

    class Config:
        orm_mode = True

class ZonaNameOutput(BaseModel):
    zon_name: str = Field(..., alias="zona_name")
    class Config:
        #orm_mode = True
        from_attributes=True
        populate_by_name  = True
