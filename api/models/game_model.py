from pydantic import BaseModel, EmailStr, Field

class Game(BaseModel):
    id: int
    nom: str
    studio: str
    plateforme: str
    annee: str
    genre: str
    description: str
    image: str
    