from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.orm import Session

from services.me_services import *
from security.token_services import *
from models.account_model import *
from database import get_db

router = APIRouter (
    prefix="/me",
    tags=["Me"]
)

# Update Favorites
@router.put('/updateFavorite')
async def update_favorites (updateInfos: AccountInputUpdateFavorite,token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    updateInfos.name = token_data["sub"]
    result = update_of_favorites(updateInfos, db)
    if result :
        return
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")

# Get Favorites
@router.post("/collection")
async def get_favorites (token_data = Depends(check_token), db: Session = Depends(get_db)):
    name = token_data["sub"]
    result = await get_favoris_logic(name, db)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")
    return {"favorites": result}