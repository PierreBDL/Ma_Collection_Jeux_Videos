from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from services.me_services import *
from services.token_services import *
from services.account_services import *
from models.account_model import *

# Routers
from routers.account_router import router as authRouter
from routers.game_router import router as gameRouter

# Hash mdp
hash_mdp()


app = FastAPI()
app.include_router(authRouter)
app.include_router(gameRouter)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Update Favorites
@app.put('/me/updateFavorite')
async def update_favorites (updateInfos: AccountInputUpdateFavorite, user: dict = Depends(check_token)):
    result = await update_of_favorites(updateInfos)
    if result :
        return
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")