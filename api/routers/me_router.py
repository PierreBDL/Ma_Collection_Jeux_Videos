from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from services.me_services import *
from security.token_services import *
from models.account_model import *
from models.me_model import *
from database import get_db

router = APIRouter (
    prefix="/me",
    tags=["Me"]
)

# Add Favorite
@router.post("/collection", status_code=status.HTTP_201_CREATED, response_model=FavoriteOutput)
async def new_favorite(updateInfos: NewFavorisInput, token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    return add_favorite(updateInfos, token_data["sub"], db)

# Update Favorite
@router.patch("/collection/{entry_id}", response_model=FavoriteOutput)
async def update_favorites(entry_id: int, updateInfos: UpdateFavorisInput, token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    return update_a_favorite(entry_id, updateInfos, token_data["sub"], db)

# Delete Favorite
@router.delete("/collection/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_favorite(entry_id: int, token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    delete_a_favorite(entry_id, token_data["sub"], db)

# Get Favorites
@router.get("/collection", response_model=FavoriteOutput)
async def get_favorites (statut: str = None, tri: str = None, token_data = Depends(check_token), db: Session = Depends(get_db)):
    return await get_favoris_logic(statut, tri, token_data["sub"], db)

# Stats
@router.get("/stats", response_model=FavoriteOutput)
async def get_favorites (token_data = Depends(check_token), db: Session = Depends(get_db)):
    return await get_stats(token_data["sub"], db)
