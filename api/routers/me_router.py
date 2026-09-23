from fastapi import APIRouter, status, HTTPException

from services.me_services import *
from security.token_services import *
from models.account_model import *

router = APIRouter (
    prefix="/me",
    tags=["Me"]
)

# Update Favorites
@router.put('/updateFavorite')
async def update_favorites (updateInfos: AccountInputUpdateFavorite,_ = Depends(check_token)):
    result = await update_of_favorites(updateInfos)
    if result :
        return
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")

# Get Favorites
@router.post("/collection")
async def get_favorites (token_data = Depends(check_token)):
    name = token_data["sub"]
    result = await get_favoris_logic(name)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable")
    return {"favorites": result}