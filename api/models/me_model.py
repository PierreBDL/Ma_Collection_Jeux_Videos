from typing import Literal
from pydantic import BaseModel, Field
from models.game_model import Game

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
    statut: Statut = "a_decouvrir"
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = Field(default=None, max_length=500)
    date_ajout: str | None = None


class UpdateFavorisInput(BaseModel):
    statut: Statut | None = None
    note: int | None = Field(default=None, ge=1, le=5)
    commentaire: str | None = Field(default=None, max_length=500)
    date_ajout: str | None = None

class FavoriteOutput(BaseModel):
    id: int
    statut: Statut
    note: int | None
    commentaire: str | None
    date_ajout: str | None
    item: Game
