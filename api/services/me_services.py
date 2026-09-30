from sqlalchemy.orm import Session
from sqlalchemy import select

from models.account_model import *
from data.account_data import *
from schemas.users_table import UsersTable
from schemas.games_table import GamesTable
from models.me_model import *
from schemas.users_favorites_table import UserFavorite
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

# Sauvegarde de la note
def save_the_grade(updateInfos: SaveGradeInput, db: Session):
    statement_user = select(UsersTable).where(UsersTable.name == updateInfos.name)
    user = db.scalars(statement_user).first()

    game = db.get(GamesTable, updateInfos.game_id)
    
    if user is None or game is None:
        return False

    statement = select(UserFavorite).where(UserFavorite.game_id == updateInfos.game_id, UserFavorite.user_id == user.id)
    user_favo = db.scalars(statement).first()
    
    if user_favo is not None :
        if updateInfos.grade is not None:
            user_favo.grade = updateInfos.grade
        if updateInfos.opinion is not None:
            user_favo.opinion = updateInfos.opinion
        if updateInfos.state is not None:
            user_favo.state = updateInfos.state
        db.commit()
        db.refresh(user_favo)
        return True
    return False

# Récup de la note
def get_the_grade (username: str, game_id: int, db: Session):
    statement_user = select(UsersTable).where(UsersTable.name == username)
    user = db.scalars(statement_user).first()

    statement = db.get(UserFavorite, (user.id, game_id))

    if statement is None : 
        return {"id": game_id,"opinion": "", "grade": 0, "state": "a_decouvrir"}

    return {"id": game_id, "opinion": statement.opinion, "grade": statement.grade, "state": statement.state}

# Récup des notes
def get_all_the_grade (username: str, db: Session):
    statement_user = select(UsersTable).where(UsersTable.name == username)
    user = db.scalars(statement_user).first()
    if user is None:
        return None

    statement = (select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id))
    games = db.execute(statement).all()

    if statement is None : 
        return None

    games_to_return = []

    for favoris, game_data in games:
        game = {
            "id": favoris.game_id,
            "nom": game_data.nom,
            "opinion": favoris.opinion,
            "grade": favoris.grade,
            "state": favoris.state
        }
        games_to_return.append(game)

    return games_to_return