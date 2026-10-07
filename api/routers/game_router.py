from fastapi import APIRouter, status, HTTPException, Depends
from database import get_db
from sqlalchemy.orm import Session

from data.game_data import *
from models.game_model import *

from schemas.games_table import GamesTable

from services.games_services import *

router = APIRouter (
    prefix="/games",
    tags=["Games"]
)

# Get games
@router.get("", response_model=All_Games)
async def get_games(counterResult: dict = Depends(counter), db: Session = Depends(get_db)):
    return await get_see_more(counterResult, db)

@router.get("/search", response_model=Search_Games)
async def get_all_games(therme: str = "", origin: str = "bySearchBar", counterResult: dict = Depends(counter), db: Session = Depends(get_db)):
    return await get_see_more_research(therme, origin, counterResult, db)

@router.get("/{game_id}", response_model=Game)
async def get_game_by_id(game_id: int, db: Session = Depends(get_db)):
    return await get_by_id(game_id, db)