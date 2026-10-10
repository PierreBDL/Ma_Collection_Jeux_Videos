from pydantic import BaseModel

##############################################################

# Général

class Game(BaseModel):
    id: int
    titre: str
    categorie: str
    description: str
    image_url: str
    annee: str
    studio: str
    plateforme: str

class All_Games(BaseModel):
    results: list[Game]
    limit: int
    page: int
    total: int


