from fastapi import APIRouter, status, HTTPException

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