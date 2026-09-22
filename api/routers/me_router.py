from fastapi import APIRouter, status, HTTPException

from services.me_services import *
from services.token_services import *
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