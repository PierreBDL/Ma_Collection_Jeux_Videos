from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

class Jeu(BaseModel):
    id: int
    nom: str
    studio: str
    plateforme: str
    annee: str
    genre: str

jeux = [
    {
        "id": 1,
        "nom": "Zelda OOT",
        "studio": "Nintendo",
        "plateforme": "Switch 2",
        "annee": "2026",
        "genre": "Retro"
    },
    {
        "id": 2,
        "nom": "Cyberpunk 2077",
        "studio": "CD Projekt Red",
        "plateforme": "PC",
        "annee": "2020",
        "genre": "RPG"
    },
    {
        "id": 3,
        "nom": "Hades II",
        "studio": "Supergiant Games",
        "plateforme": "PC",
        "annee": "2024",
        "genre": "Roguelike"
    },
    {
        "id": 4,
        "nom": "Elden Ring",
        "studio": "FromSoftware",
        "plateforme": "PS5",
        "annee": "2022",
        "genre": "Action-RPG"
    }
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/jeux")
def get_jeux () :
    return jeux