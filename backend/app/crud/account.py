from sqlalchemy.orm import Session
from typing import List, Optional
from passlib.context import CryptContext

from app import models
from app.schemas.Account import *

# Para encriptar la contraseña
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función para hashear la contraseña
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# --- CRUD OPERATIONS ---

# Obtener todos los usuarios
def get_accounts(db: Session, skip: int = 0, limit: int = 100) -> List[models.Account]:
    return db.query(models.Account).offset(skip).limit(limit).all()


# Obtener usuario por ID
def get_account(db: Session, account_id: int) -> Optional[models.Account]:
    return db.query(models.Account).filter(models.Account.ac_key == account_id).first()


# Obtener usuario por email
def get_account_by_email(db: Session, email: str) -> Optional[models.Account]:
    return db.query(models.Account).filter(models.Account.ac_email == email).first()

def get_account_by_username(db: Session, username: str) -> Optional[models.Account]:
    return db.query(models.Account).filter(models.Account.ac_username == username).first()


# Crear un nuevo usuario
def create_account(db: Session, account_in: AccountCreate) -> models.Account:
    hashed_password = get_password_hash(account_in.ac_password)
    db_account = models.Account(
        ac_email=account_in.ac_email,
        ac_username=account_in.ac_username,
        ac_password=hashed_password,
        ac_birthday=account_in.ac_birthday,
        ac_question_security=account_in.ac_question_security,
        ac_answer_sec=account_in.ac_answer_sec,
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


# Actualizar usuario
def update_account(db: Session, db_obj: models.Account, obj_in: AccountUpdate) -> models.Account:
    for field, value in obj_in.dict(exclude_unset=True).items():
        if field == "ac_password":
            value = get_password_hash(value)
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# Eliminar usuario
def delete_account(db: Session, account_id: int) -> None:
    account = db.query(models.Account).filter(models.Account.ac_key == account_id).first()
    if account:
        db.delete(account)
        db.commit()
