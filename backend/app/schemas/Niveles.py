from pydantic import BaseModel, Field
from datetime import  datetime


class BaseNiveles(BaseModel):
    ni_level: int = Field(..., alias="nivel")
    ni_exp_necessary: int = Field(..., alias="exp_necesaria")
    ni_exp_accumulated: int = Field(..., alias="exp_acumulada")
    ni_oro_reward: int = Field(..., alias="oro_recompensa")
    ni_habilidad: int = Field(..., alias="canjes")
    ni_other_reward: int = Field(..., alias="otra_recompensa")

class OutputNiveles(BaseNiveles):
    ni_id: int = Field(..., alias="id")
    ni_createddate: datetime = Field(..., alias="creado")

    class Config():
        from_attributes= True
        populate_by_name= True