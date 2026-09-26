from pydantic import BaseModel, EmailStr, Field
from models.game_model import *

class AccountInputUpdateFavorite(BaseModel):
    name: str
    favorites: list[Game] = []

class SaveGradeInput(BaseModel):
    name: str = Field(...)
    game_id: int = Field(...)
    opinion: str = Field(default="", max_length=500)
    grade: int = Field(..., ge=1, le=5)

class GetGradeInput(BaseModel):
    name: str = Field(...)
    game_id: int = Field(...)