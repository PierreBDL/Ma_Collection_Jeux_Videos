from pydantic import BaseModel, ConfigDict

# Général

class Game(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nom: str
    studio: str
    plateforme: str
    annee: str
    genre: str
    description: str
    image: str
    etat: str = "a_decouvrir"
    note: float = 0
    commentaire: str = ""
    date: str

class All_Games(BaseModel):
    games: list[Game]
    limit: int
    total: int
    skip: int

class Search_Games(BaseModel):
    games: list[Game]