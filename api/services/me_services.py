from sqlalchemy.orm import Session
from sqlalchemy import select

from models.account_model import *
from data.account_data import *
from schemas.users_table import UsersTable
from schemas.games_table import GamesTable
from models.me_model import *
from schemas.users_favorites_table import UserFavorite

# Mise à jour des favoris
def update_of_favorites(updateInfos: AccountInputUpdateFavorite, db: Session):
    statement = select(UsersTable).where(UsersTable.name == updateInfos.name)
    user = db.scalars(statement).first()
    
    if user is not None :
        favorites_tab = []
        for i in updateInfos.favorites:
            game_bdd = db.get(GamesTable, i.id)
            if game_bdd:
                favorites_tab.append(game_bdd)
        user.favorites = favorites_tab
        db.commit()
        db.refresh(user)
        return True
    return False

# Chercher et envoyer favoris
async def get_favoris_logic (name: str, db: Session) :
    statement = select(UsersTable).where(UsersTable.name == name)
    user = db.scalars(statement).first()
        
    if user is not None :
        return user.favorites
    return None

# Sauvegarde de la note
def save_the_grade(updateInfos: SaveGradeInput, db: Session):
    statement_user = select(UsersTable).where(UsersTable.name == updateInfos.name)
    user = db.scalars(statement_user).first()
    if not user:
        return False

    statement = select(UserFavorite).where(UserFavorite.game_id == updateInfos.game_id, UserFavorite.user_id == user.id)
    user_favo = db.scalars(statement).first()
    
    if user_favo is not None :
        user_favo.grade = updateInfos.grade
        user_favo.opinion = updateInfos.opinion
        db.commit()
        db.refresh(user_favo)
        return True
    return False