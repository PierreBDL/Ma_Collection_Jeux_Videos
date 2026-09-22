from models.account_model import *
from data.account_data import *
from passlib.context import CryptContext
import jwt

# Charger env
from dotenv import load_dotenv
import os
load_dotenv()

pwd = CryptContext(schemes=["pbkdf2_sha256"])
secretKey = os.getenv('SECRET')

# Hash du mdp hardcodé
def hash_mdp () :
    for i in account :
        i["password"] = pwd.hash(i["password"])

# Login
async def test_login(user: AccountInput):
    for i in account:
        if i["email"] == user.email and pwd.verify(user.password, i["password"]):
            token = jwt.encode({"sub": user.email}, secretKey, algorithm="HS256")
            return token
    return {}
    