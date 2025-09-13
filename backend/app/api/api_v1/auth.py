from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta


from app.db import Session, get_db
from app.models.Account import Account
from app.schemas.auth import Token
from app.auth_utils import create_access_token, verify_password
from app.schemas.Account import AccountOut

SECRET_KEY = "angelfenix_secretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
router = APIRouter()


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Account).filter(Account.ac_username == form_data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")

    # Para texto plano temporal
    #if user.ac_password != form_data.password:
    #    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="La contraseña ingresada es incorrecta")

    # Futuro: si usas hashed password
    if not verify_password(form_data.password, user.ac_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="¡Oh no!. La contraseña que has ingresado es incorrecta")

    access_token = create_access_token(data={"sub": user.ac_username, "cuenta":user.ac_key})
    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        cuenta: int = payload.get("cuenta")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"username": username, "cuenta":cuenta}

@router.get("/me")
def read_me(current_cuenta: dict = Depends(get_current_user)):
    return {"user": current_cuenta["username"], "cuenta":current_cuenta["cuenta"]}
