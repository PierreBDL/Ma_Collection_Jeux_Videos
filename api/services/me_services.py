from sqlalchemy.orm import Session
from sqlalchemy import select

from models.account_model import *
from data.account_data import *
from schemas.users_table import UsersTable
from schemas.games_table import GamesTable

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