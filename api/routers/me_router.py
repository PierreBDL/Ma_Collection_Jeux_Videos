from fastapi import APIRouter, status, HTTPException, Depends
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

# Update Favorites
@router.patch('/updateFavorite')
async def update_favorites (updateInfos: AccountInputUpdateFavorite,token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    return await update_of_favorites(updateInfos, token_data["sub"], db)

# Get Favorites
@router.get("/collection")
async def get_favorites (token_data = Depends(check_token), db: Session = Depends(get_db)):
    return await get_favoris_logic(token_data["sub"], db)

# Sauvegarde commentaire et avis
@router.patch("/saveGrade")
async def save_grade (updateInfos: SaveGradeInput,token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    return await save_the_grade(updateInfos, token_data["sub"], db)

# Obtenir les infos d'un jeu d'un utilisateur
@router.get("/getGrade")
async def get_grade (game_id: int, token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    return await get_the_grade(token_data["sub"], game_id, db)

# Récupérer toutes les notes
@router.get("/getAllGrade")
async def get_grade (token_data: dict = Depends(check_token), db: Session = Depends(get_db)):
    return await get_all_the_grade(token_data["sub"], db)
