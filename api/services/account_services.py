from models.account_model import *
from data.account_data import *
from passlib.context import CryptContext
import jwt

from services.token_services import *

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
            return create_tokens(i)
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
    return create_tokens(user)
