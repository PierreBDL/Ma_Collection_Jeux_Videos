from fastapi import APIRouter, status, HTTPException, Depends
from database import get_db
from sqlalchemy.orm import Session

# Données des jeux
from data.game_data import *

# Model
from models.game_model import *

# Table SQL
from schemas.games_table import GamesTable

# Logique
from services.games_services import *

##############################################################

router = APIRouter (
    prefix="/items",
    tags=["Games"]
)

# Get games
@router.get("", response_model=All_Games)
async def get_games(q: str = "", categorie: str = "bySearchBar", counterResult: dict = Depends(counter), db: Session = Depends(get_db)):
    return await get_see_more(q, categorie, counterResult, db)

@router.get("/{game_id}", response_model=Game)
async def get_game_by_id(game_id: int, db: Session = Depends(get_db)):
    return get_by_id(game_id, db)
