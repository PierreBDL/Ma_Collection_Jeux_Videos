from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from passlib.context import CryptContext

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