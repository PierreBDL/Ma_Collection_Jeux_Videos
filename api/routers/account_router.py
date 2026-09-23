from fastapi import APIRouter, status, HTTPException, Header

from data.account_data import *
from models.account_model import *
from services.account_services import *

router = APIRouter (
    prefix="/auth",
    tags=["Auth"]
)

# Login

@router.post("/login")
async def login(user: AccountInput, status_code=status.HTTP_200_OK):
    result = await test_login(user)

    if result == {} :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Courriel ou mot de passe incorrect !")

    return result

# Register
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: AccountRegisterInput):
    result = await test_register(user)

    if result == {} :
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Courriel déjà pris !")

    return result

# Refresh du token
@router.post("/refresh")
async def refresh (long_token: str = Header(...)):
    try:
        token = jwt.decode(long_token, secretKey, algorithms=[Algorithm])

        if token["type"] != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

        username = token["name"]

        access_expire = datetime.now(timezone.utc) + timedelta(minutes=20)
        access_token = jwt.encode({"sub": username, "exp": access_expire, "type": "access"}, secretKey, algorithm=Algorithm)

        return {"access_token": access_token, "token_type": "bearer"}

    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expiré")