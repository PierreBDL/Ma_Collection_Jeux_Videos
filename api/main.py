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

# Hash mdp
hash_mdp()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get games

@app.get("/games")
def get_games () :
    return jeux

@app.get("/game/{game_id}")
def get_game_by_id (game_id: int) :
    for i in jeux:
        if game_id == i["id"] :
            return i
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jeu introuvable")


# Login

@app.post("/auth/login")
async def login(user: AccountInput, status_code=status.HTTP_200_OK):
    result = await test_login(user)

    if result == {} :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Courriel ou mot de passe incorrect !")

    return result

# Register
@app.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user: AccountRegisterInput):
    result = await test_register(user)

    if result == {} :
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Courriel déjà pris !")

    return result

# Update Favorites
@app.put('/updateFavorite')
async def update_favorites (updateInfos: AccountInputUpdateFavorite, user: dict = Depends(check_token)):
    result = await update_of_favorites(updateInfos)
    if result :
        return
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")