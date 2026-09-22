from pydantic import BaseModel, EmailStr, Field
from models.game_model import *

class AccountInput(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8, description="Le mot de passe doit contenir 8 caractères")

class AccountRegisterInput(AccountInput):
    name: str = Field(..., min_length=3, max_length=20)

class AccountOutput(BaseModel):
    id: int
    name: str
    email: EmailStr
    favorites: list[Game] = []

class AccountInputUpdateFavorite(BaseModel):
    name: str
    favorites: list[Game] = []