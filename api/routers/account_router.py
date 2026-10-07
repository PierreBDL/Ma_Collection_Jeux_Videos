from fastapi import APIRouter, status, HTTPException, Header
from sqlalchemy.orm import Session

from data.account_data import *
from models.account_model import *
from services.account_services import *
from database import get_db
from security.token_services import check_token

router = APIRouter (
    prefix="/auth",
    tags=["Auth"]
)

# Login

@router.post("/login", status_code=status.HTTP_200_OK, response_model=AccountLoginOutput)
async def login(user: AccountInput, db: Session = Depends(get_db)):
    result = await test_login(user, db)
    if result is None :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Courriel ou mot de passe incorrect !")
    return result

# Register
@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=AccountRegisterOutput)
async def register(user: AccountRegisterInput, db: Session = Depends(get_db)):
    result = await test_register(user, db)
    if result is None :
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Identifiants déjà pris !")
    return result

# Me
@router.get("/me", response_model=AccountRegisterOutput)
async def get_me (token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    result = await get_user(token_data["sub"], db)
    if result is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Informations incorrectes")
    return result

# Refresh du token
@router.post("/refresh")
async def refresh (refreshToken: str = Header(...)):
    try:
        refreshToken = refreshToken.replace("Bearer ", "").strip()

        token = jwt.decode(refreshToken, secretKey, algorithms=[Algorithm])

        if token["type"] != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide")

        username = token["sub"]

        access_expire = datetime.now(timezone.utc) + timedelta(minutes=20)
        access_token = jwt.encode({"sub": username, "exp": access_expire, "type": "access"}, secretKey, algorithm=Algorithm)

        return access_token

    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expiré")