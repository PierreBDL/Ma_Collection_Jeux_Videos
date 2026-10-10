from fastapi import APIRouter, status, Header
from sqlalchemy.orm import Session

# Compte hardcodé
#from data.account_data import *

# Model
from models.account_model import *

# Logique
from services.account_services import *

# BDD
from database import get_db

# Token logique
from security.token_services import check_token

##############################################################

router = APIRouter (
    prefix="/auth",
    tags=["Auth"]
)

# Login

@router.post("/login", status_code=status.HTTP_200_OK, response_model=AccountLoginOutput)
async def login(user: AccountInput, db: Session = Depends(get_db)):
    return await test_login(user, db)

# Register
@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=AccountRegisterOutput)
async def register(user: AccountRegisterInput, db: Session = Depends(get_db)):
    return await test_register(user, db)

# Me
@router.get("/me", response_model=AccountMeOutput)
async def get_me (token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    return await get_user(token_data["sub"], db)

# Refresh du token
@router.post("/refresh")
async def refresh (refreshToken: str = Header(...)):
    return await refresh_token(refreshToken)