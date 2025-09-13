from fastapi import APIRouter
from app.api.api_v1 import Account, auth, Caballero, Divinidad, Zodiaco

api_router = APIRouter()
api_router.include_router(Account.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(Caballero.router, prefix="/caballeros", tags=["caballeros"])
api_router.include_router(Divinidad.router, prefix="/divinidades", tags=["divinidades"])
api_router.include_router(Zodiaco.router, prefix="/zodiaco", tags=["zodiaco"])
