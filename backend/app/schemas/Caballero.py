from pydantic import BaseModel, Field,  model_validator
from datetime import datetime
from typing import Optional

class CaballeroBase(BaseModel):
    ca_name: str = Field(..., alias="nombre")
    ca_level: int = Field(1, alias="nivel")
    ca_experience: int = Field(0, alias="experiencia")
    ca_gold: int = Field(300, alias="oro")
    ca_hability: int = Field(0, alias="habilidad")
    ca_health: int = Field(250, alias="salud")
    ca_health_act: int = Field(250, alias="salud_actual")

    # atributos de combate
    ca_velocity: int = Field(1, alias="velocidad")
    ca_power: int = Field(1, alias="poder")
    ca_knowledge: int = Field(1, alias="conocimiento")
    ca_precision: int = Field(1, alias="precision")
    ca_agility: int = Field(1, alias="agilidad")
    ca_resistance: int = Field(1, alias="resistencia")
    ca_psy_resistance: int = Field(1, alias="resistencia_mental")
    ca_persistence: int = Field(1, alias="persistencia")
    ca_cosmo: int = Field(1, alias="cosmo")
    ca_cosmo_act: int = Field(0, alias="cosmo_actual")
    ca_seventh_sense: int = Field(1, alias="septimo_sentido")
    ca_seventh_sense_act: int = Field(0, alias="septimo_sentido_actual")

    # honor y llaves externas
    ca_honor: int = Field(10, alias="honor")
    ca_di_key: int = Field(..., alias="id_divinidad")
    ca_zo_key: int = Field(..., alias="id_signo")

    # WR
    ca_win: int = Field(0, alias="victorias")
    ca_loss: int = Field(0, alias="derrotas")

    # zona y estado
    ca_zon_key_act: int = Field(1, alias="zona_actual")
    ca_status: str = Field("Ready", alias="estado")
    ca_comments: Optional[str] = Field(None, alias="comentarios")

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
    ca_ac_key: int = Field(..., alias="id_avatar")
    ca_name: str = Field(..., alias="nombre")
    ca_di_key: int = Field(..., alias="id_divinidad")
    ca_zo_key: int = Field(..., alias="id_zodiaco")

    # Stats iniciales (opcionales, con default)
    ca_velocity: int = Field(1, alias="velocidad")
    ca_power: int = Field(1, alias="poder")
    ca_knowledge: int = Field(1, alias="conocimiento")
    ca_precision: int = Field(1, alias="precision")
    ca_agility: int = Field(1, alias="agilidad")
    ca_resistance: int = Field(1, alias="resistencia")
    ca_psy_resistance: int = Field(1, alias="resistencia_mental")
    ca_persistence: int = Field(1, alias="persistencia")
    ca_cosmo: int = Field(1, alias="cosmo")
    ca_seventh_sense: int = Field(1, alias="septimo_sentido")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
    
    @model_validator(mode='after')
    def check_habilidad_points(cls, values):
        habilidades = [
            "ca_velocity",
            "ca_power",
            "ca_knowledge",
            "ca_precision",
            "ca_agility",
            "ca_resistance",
            "ca_psy_resistance",
            "ca_persistence",
            "ca_cosmo",
            "ca_seventh_sense"
        ]
        total_extra = sum(getattr(values, h, 1) - 1 for h in habilidades)
        if total_extra > 20:
            raise ValueError(f"Solo se pueden asignar 20 puntos extra entre todas las habilidades. Se asignaron {total_extra}.")
        return values


class CaballeroUpdateStat(BaseModel):
    ca_key: int = Field(..., alias="id")
    stat: str = Field(..., alias="stat")
    

    class Config:
        from_attributes = True
        populate_by_name = True

class CaballeroOut(CaballeroBase):
    ca_key: int = Field(..., alias="id")
    ca_ac_key: int = Field(..., alias="id_avatar")
    ca_createdate: datetime = Field(..., alias="fecha_creacion")
    ca_lastlogin: Optional[datetime] = Field(None, alias="ultimo_login")
    ca_lastaction: Optional[datetime] = Field(None, alias="ultima_accion")
    ca_status_player: bool = Field(..., alias="jugando")

    class Config:
        #orm_mode = True
        from_attributes=True
        populate_by_name  = True
