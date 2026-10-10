from pydantic import BaseModel

##############################################################

# Général

class Game(BaseModel):
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
    date: str = ""

class All_Games(BaseModel):
    results: list[Game]
    limit: int
    page: int
    total: int


