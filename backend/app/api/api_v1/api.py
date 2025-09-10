from fastapi import APIRouter
from app.api.api_v1 import Account, auth

api_router = APIRouter()
api_router.include_router(Account.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
