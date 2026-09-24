from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
from sqlalchemy import select

from models.account_model import *
from data.account_data import *
from schemas.users_table import UsersTable

# Mise à jour des favoris
def update_of_favorites(updateInfos: AccountInputUpdateFavorite, db: Session):
    statement = select(UsersTable).where(UsersTable.name == updateInfos.name)
    user = db.scalars(statement).first()
    
    if user is not None :
        favorites_front = []
        for fav in updateInfos.favorites:
            favorites_front.append(fav.model_dump())
        user.favorites = favorites_front
        flag_modified(user, "favorites")
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