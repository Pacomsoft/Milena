from fastapi import APIRouter
from app.api.api_v1 import Account, auth, Caballero, Divinidad, Zodiaco, Boost, Habilidades, server

api_router = APIRouter()
api_router.include_router(Account.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(Caballero.router, prefix="/caballeros", tags=["caballeros"])
api_router.include_router(Divinidad.router, prefix="/divinidades", tags=["divinidades"])
api_router.include_router(Zodiaco.router, prefix="/zodiaco", tags=["zodiaco"])
api_router.include_router(Boost.router, prefix="/boost", tags=["boost"])
api_router.include_router(Habilidades.router, prefix="/habilidades", tags=["habilidades"])
api_router.include_router(server.router, prefix="/server", tags=["server"])