from models.account_model import *
from data.account_data import *
from passlib.context import CryptContext
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Charger env
from dotenv import load_dotenv
import os
load_dotenv()

pwd = CryptContext(schemes=["pbkdf2_sha256"])
secretKey = os.getenv('SECRET')

# Vérif du token
oauth = OAuth2PasswordBearer(tokenUrl="sub")

def check_token (token: str = Depends(oauth)) :
    try:
        result = jwt.decode(token, secretKey, algorithms=["HS256"])
        return result
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token incorrect")

# Hash du mdp hardcodé
def hash_mdp () :
    for i in account :
        i["password"] = pwd.hash(i["password"])

# Login
async def test_login(user: AccountInput):
    for i in account:
        if i["email"] == user.email and pwd.verify(user.password, i["password"]):
            token = jwt.encode({"sub": i["name"]}, secretKey, algorithm="HS256")
            return {"token" : token, "name": i["name"], "favorites": i["favorites"]}
    return {}

# Register
async def test_register(user: AccountRegisterInput):
    for i in account:
        if i["email"] == user.email:
            return {}

    newAccount = {
        "id": (max([i["id"] for i in account], default=0) + 1),
        "name": user.name,
        "email": user.email,
        "password": pwd.hash(user.password),
        "favorites": []
    }
    account.append(newAccount)
    return newAccount

# Mise à jour des favoris
async def update_of_favorites(updateInfos: AccountInputUpdateFavorite):
    for i in account:
        if updateInfos.name == i["name"]:
            i["favorites"] = updateInfos.favorites
            return True
    return False