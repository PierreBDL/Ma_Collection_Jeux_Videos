from typing import Literal

from pydantic import BaseModel, EmailStr, Field
from models.game_model import *

class AccountInputUpdateFavorite(BaseModel):
    name: str
    favorites: list[Game] = []

class SaveGradeInput(BaseModel):
    name: str = Field(...)
    game_id: int = Field(...)
    opinion: str | None = Field(default=None, max_length=500)
    grade: int | None = Field(default=None, ge=1, le=5)
    state: Literal["a_decouvrir", "en_cours", "termine"] = "a_decouvrir"

class GetGradeInput(BaseModel):
    name: str = Field(...)
    game_id: int = Field(...)