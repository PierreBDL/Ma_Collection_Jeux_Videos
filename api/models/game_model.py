from pydantic import BaseModel

##############################################################

# Général

class Game(BaseModel):
    id: int
    nom: str
    genre: str
    description: str
    image: str
    annee: str
    studio: str
    plateforme: str

class All_Games(BaseModel):
    results: list[Game]
    limit: int
    page: int
    total: int


