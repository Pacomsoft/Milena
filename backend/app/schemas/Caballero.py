from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CaballeroBase(BaseModel):
    ca_name: str
    ca_level: int = 1
    ca_experience: int = 0
    ca_gold: int = 300
    ca_hability: int = 0
    ca_health: int = 250
    ca_health_act: int = 250

    # atributos de combate
    ca_velocity: int = 1
    ca_power: int = 1
    ca_knowledge: int = 1
    ca_precision: int = 1
    ca_agility: int = 1
    ca_resistance: int = 1
    ca_psy_resistance: int = 1
    ca_persistence: int = 1
    ca_cosmo: int = 1
    ca_cosmo_act: int = 0
    ca_seventh_sense: int = 1
    ca_seventh_sense_act: int = 0

    # honor y llaves externas
    ca_honor: int = 10
    ca_di_key: int
    ca_zo_key: int

    # WR
    ca_win: int = 0
    ca_loss: int = 0

    # zona y estado
    ca_zon_key_act: int = 1
    ca_status: str = "Ready"
    ca_comments: Optional[str] = None

#Esquema compartido
class CaballeroUpdate(BaseModel):
    ca_velocity: Optional[int] = None
    ca_power: Optional[int] = None
    ca_knowledge: Optional[int] = None
    ca_precision: Optional[int] = None
    ca_agility: Optional[int] = None
    ca_resistance: Optional[int] = None
    ca_psy_resistance: Optional[int] = None
    ca_persistence: Optional[int] = None
    ca_cosmo: Optional[int] = None
    ca_seventh_sense: Optional[int] = None
    ca_hability: int
    ca_gold: int
    
class CaballeroCreate(BaseModel):
    ca_ac_key: int
    ca_name: str
    ca_di_key: int
    ca_zo_key: int

class CaballeroOut(CaballeroBase):
    ca_key: int
    ca_ac_key: int
    ca_createdate: datetime
    ca_lastlogin: Optional[datetime] = None
    ca_lastaction: Optional[datetime] = None
    ca_status_player: bool

    class Config:
        orm_mode = True


    

