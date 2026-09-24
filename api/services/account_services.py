from models.account_model import *
from data.account_data import *
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import select

from security.token_services import *
from schemas.users_table import UsersTable

# Charger env
from dotenv import load_dotenv
import os
load_dotenv()

PwdAlgo = os.getenv("PWD_ALGORITHM")
pwd = CryptContext(schemes=[PwdAlgo])
secretKey = os.getenv('SECRET')
Algorithm = os.getenv('ALGORITHM')

# Hash du mdp hardcodé
def hash_mdp () :
    for i in account :
        i["password"] = pwd.hash(i["password"])

# Login
async def test_login(user: AccountInput, db: Session):
    statement = select(UsersTable).where(UsersTable.email == user.email)
    db_user = db.scalars(statement).first()

    if db_user and pwd.verify(user.password, db_user.password):
        return create_tokens(db_user)

    return {}
# Register
async def test_register(user: AccountRegisterInput, db: Session):
    
    # Vérif si libre
    statementEmail = select(UsersTable).where(UsersTable.email == user.email)
    if db.scalars(statementEmail).first() is not None:
        return {}

    # Enregistrer
    newAccount = UsersTable (
        name=user.name,
        email=user.email,
        password=pwd.hash(user.password),
        favorites=[]
    )
    
    db.add(newAccount)
    db.commit()
    db.refresh(newAccount)
    return create_tokens(newAccount)
