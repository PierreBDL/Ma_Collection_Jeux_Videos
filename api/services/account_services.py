from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import select

# Gestion du token
from security.token_services import *

# Model
from models.account_model import *

# Compte hardcodé
# from data.account_data import *

# Table SQL
from schemas.users_table import UsersTable

# HTTP Exception
from utils.httpErrors import http_exception

##############################################################


# Charger env
from dotenv import load_dotenv
import os
load_dotenv()

PwdAlgo = os.getenv("PWD_ALGORITHM")
pwd = CryptContext(schemes=[PwdAlgo])
secretKey = os.getenv('SECRET')
Algorithm = os.getenv('ALGORITHM')

# Hash du mdp hardcodé 
# def hash_mdp () :
#    for i in account :
#       i["password"] = pwd.hash(i["password"])

# Login
async def test_login(user: AccountInput, db: Session):
    statement = select(UsersTable).where(UsersTable.email == user.email)
    db_user = db.scalars(statement).first()

    if db_user and pwd.verify(user.password, db_user.password):
        return create_tokens(db_user)

    # Erreur
    http_exception(code=401, message="Courriel ou mot de passe incorrect !")


# Register
async def test_register(user: AccountRegisterInput, db: Session):
    
    # Vérif si libre
    statement = select(UsersTable).where(UsersTable.email == user.email or UsersTable.name == user.name)
    
    if db.scalars(statement).first() is not None:
        # Erreur
        http_exception(code=409, message="Identifiants déjà pris !")

    # Save
    newAccount = UsersTable (
        name=user.name,
        email=user.email,
        password=pwd.hash(user.password),
        favorites=[]
    )
    
    db.add(newAccount)
    db.commit()
    db.refresh(newAccount)

    return {"id": newAccount.id, "email": newAccount.email}

# Auth me
async def get_user (username: str, db: Session):
    statement = select(UsersTable).where(UsersTable.name == username)
    user = db.scalars(statement).first()
    if user is None:
        # Erreur
        http_exception(code=401, message="Informations incorrectes")

    return {"email": user.email, "id": user.id, "name": user.name}

# Refresh token
async def refresh_token (token: str):
    try:
        refreshToken = token.replace("Bearer ", "").strip()
    
        token = jwt.decode(refreshToken, secretKey, algorithms=[Algorithm])
    
        if token["type"] != "refresh":
            # Error
            http_exception(code=401, message="Token invalide")
        
        username = token["sub"]
    
        access_expire = datetime.now(timezone.utc) + timedelta(minutes=20)
        access_token = jwt.encode({"sub": username, "exp": access_expire, "type": "access"}, secretKey, algorithm=Algorithm)
    
        return access_token
    
    except jwt.PyJWTError:
        # Error
        http_exception(code=401, message="Token expiré")
