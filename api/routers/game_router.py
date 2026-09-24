from fastapi import APIRouter, status, HTTPException, Depends
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select

from data.game_data import *
from models.game_model import *

from schemas.games_table import GamesTable

router = APIRouter (
    prefix="/games",
    tags=["Games"]
)

# Get games
@router.get("")
def get_games (db: Session = Depends(get_db)) :
    statement = select(GamesTable)
    return db.scalars(statement).all()

@router.get("/{game_id}")
def get_game_by_id (game_id: int, db: Session = Depends(get_db)) :
    statement = db.get(GamesTable, game_id)
    if statement is None :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jeu introuvable")
    return statement