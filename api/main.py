from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Données hardcodés
from data.game_data import *
from data.account_data import *

# Modèles
from models.game_model import *
from models.account_model import *

# Logique métier
from services.account_services import *


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

@app.post("/login")
async def login(user: AccountInput):
    result = await test_login(user)

    if result == False :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Courriel ou mot de passe incorrect !")

    return {"message": "Connexion réussie"}