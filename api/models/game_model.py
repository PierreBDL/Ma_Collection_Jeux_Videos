from pydantic import BaseModel, EmailStr, Field

class Jeu(BaseModel):
    id: int
    nom: str
    studio: str
    plateforme: str
    annee: str
    genre: str
    description: str
    image: str
    