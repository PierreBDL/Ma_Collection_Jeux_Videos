from typing import Literal
from pydantic import BaseModel, Field

# Model
from models.game_model import Game

##############################################################

Statut = Literal["a_decouvrir", "en_cours", "termine"]


# Requête de synchronisation utilisée par le front existant.
class AccountInputUpdateFavorite(BaseModel):
    name: str
    favorites: list[Game] = []


class SaveGradeInput(BaseModel):
    name: str = Field(...)
    game_id: int = Field(...)
    opinion: str | None = Field(default=None, max_length=500)
    grade: int | None = Field(default=None, ge=1, le=5)
    state: Statut = "a_decouvrir"
    date: str | None = Field(default=None)


class GetGradeInput(BaseModel):
    name: str = Field(...)
    game_id: int = Field(...)


class NewFavorisInput(BaseModel):
    item_id: int
    state: Statut = "a_decouvrir"
    grade: int | None = Field(default=None, ge=1, le=5)
    opinion: str | None = Field(default=None, max_length=500)
    date: str | None = None


class UpdateFavorisInput(BaseModel):
    state: Statut | None = None
    grade: int | None = Field(default=None, ge=1, le=5)
    opinion: str | None = Field(default=None, max_length=500)
    date: str | None = None

class FavoriteOutput(BaseModel):
    favorites: list[Game]
    
# Stats
class StatsOutput(BaseModel):
    total: int
    statut: list[string, int]
    console: object
    moyenne: float
