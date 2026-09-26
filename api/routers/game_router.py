from fastapi import APIRouter, status, HTTPException, Depends
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select

from data.game_data import *
from models.game_model import *

from schemas.games_table import GamesTable

from services.games_services import *

router = APIRouter (
    prefix="/games",
    tags=["Games"]
)

# Get games
@router.get("")
def get_games (counterResult: dict = Depends(counter), db: Session = Depends(get_db)) :
    result = get_see_more(counterResult, db)
    return {"games": result}

@router.get("/{game_id}")
def get_game_by_id (game_id: int, db: Session = Depends(get_db)) :
    statement = db.get(GamesTable, game_id)
    if statement is None :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jeu introuvable")
    return statement