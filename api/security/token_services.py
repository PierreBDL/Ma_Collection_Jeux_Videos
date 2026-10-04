from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from passlib.context import CryptContext
from datetime import *

from models.account_model import *

# Charger env
from dotenv import load_dotenv
import os
load_dotenv()

pwd = CryptContext(schemes=["pbkdf2_sha256"])
secretKey = os.getenv('SECRET')
Algorithm = os.getenv('ALGORITHM')

# Vérif du token
oauth = OAuth2PasswordBearer(tokenUrl="sub")

def check_token (token: str = Depends(oauth)) :
    try:
        result = jwt.decode(token, secretKey, algorithms=[Algorithm])
        if result.get("type") == "access":
            return result
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token incorrect")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token incorrect")

# Création
def create_tokens (user: AccountInput):
    # Access
    access_expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    access_token = jwt.encode({"sub": user.name, "exp": access_expire, "type": "access"}, secretKey, algorithm=Algorithm)

    # Refresh
    refresh_expire = datetime.now(timezone.utc) + timedelta(days=1)
    refresh_token = jwt.encode({"sub": user.name, "exp": refresh_expire, "type": "refresh"}, secretKey, algorithm=Algorithm)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer", "name": user.name, "favorites": user.favorites}

