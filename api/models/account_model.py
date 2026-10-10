from pydantic import BaseModel, EmailStr, Field

# Model
from models.game_model import *

##############################################################

# Général

class AccountInput(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8, description="Le mot de passe doit contenir 8 caractères")

class AccountOutput(BaseModel):
    id: int
    name: str
    email: EmailStr
    favorites: list[Game] = []

# Inscription
class AccountRegisterInput(AccountInput):
    name: str = Field(..., min_length=3, max_length=20)

class AccountRegisterOutput(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    id: int
    email: EmailStr
    name: str
    favorites: list[Game] = []

# Login
class AccountLoginOutput(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    name: str
    favorites: list[Game] = []

# Me
class AccountMeOutput(BaseModel):
    id: int
    email: EmailStr
    name: str