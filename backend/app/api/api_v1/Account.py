from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.crud import account as AccountCRUD
from app.schemas import Account as AccountSchema
from app.db import get_db
from app.api.api_v1.auth import get_current_user


router = APIRouter()

# Obtener todos los usuarios
@router.get("/", response_model=List[AccountSchema.AccountOut])
def get_accounts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    accounts = AccountCRUD.get_accounts(db, skip=skip, limit=limit)
    return accounts


# Obtener un usuario por ID
@router.get("/{account_id}", response_model=AccountSchema.AccountOut)
def get_account(account_id: int, db: Session = Depends(get_db)):
    account = AccountCRUD.get_account(db, account_id=account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    return account


# Crear un nuevo usuario
@router.post("/", response_model=AccountSchema.AccountOut)
def create_account(account_in: AccountSchema.AccountCreate, db: Session = Depends(get_db)):
    # Verificar si ya existe el correo
    existing = AccountCRUD.get_account_by_email(db, email=account_in.ac_email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="¡El email ingresado ya está en uso por otro caballero!"
        )
    existing = AccountCRUD.get_account_by_username(db, username=account_in.ac_username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="¡El nombre de usuario ya está en uso por otro caballero!"
        )

    account = AccountCRUD.create_account(db, account_in=account_in)
    return account


# Actualizar usuario
@router.put("/{account_id}", response_model=AccountSchema.AccountOut)
def update_account(account_id: int, account_in: AccountSchema.AccountUpdate, db: Session = Depends(get_db)):
    account = AccountCRUD.get_account(db, account_id=account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    account = AccountCRUD.update_account(db, db_obj=account, obj_in=account_in)
    return account


# Eliminar usuario
@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(account_id: int, db: Session = Depends(get_db)):
    account =AccountCRUD.get_account(db, account_id=account_id)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )
    delete_account(db, account_id=account_id)
    return None
