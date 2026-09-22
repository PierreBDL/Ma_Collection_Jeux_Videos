from fastapi import APIRouter, status, HTTPException

from data.game_data import *
from models.game_model import *

router = APIRouter (
    prefix="/games",
    tags=["Games"]
)

# Get games
@router.get("/")
def get_games () :
    return jeux

@router.get("/{game_id}")
def get_game_by_id (game_id: int) :
    for i in jeux:
        if game_id == i["id"] :
            return i
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jeu introuvable")