from sqlalchemy.orm import Session
from sqlalchemy import select

from models.account_model import *
from data.account_data import *
from schemas.users_table import UsersTable
from schemas.games_table import GamesTable
from models.me_model import *
from schemas.users_favorites_table import UserFavorite
from schemas.games_table import GamesTable
from utils.httpErrors import http_exception

# Vérif si le token appartient à l'utilisateur
def check_token_name (username: str, token_name: str):
    if username != token_name :
        http_exception(code=401, message="Token invalide")
    return


# Convertit un favori et son jeu en réponse pour le front existant.
def _favorite_response(favorite: UserFavorite, game: GamesTable):
    return {
        "id": game.id,
        "nom": game.nom,
        "studio": game.studio,
        "plateforme": game.plateforme,
        "annee": game.annee,
        "genre": game.genre,
        "description": game.description,
        "image": game.image,
        "opinion": favorite.opinion or "",
        "grade": favorite.grade or 0,
        "state": favorite.state or "a_decouvrir",
        "date": favorite.date
    }


def _entry_response(favorite: UserFavorite, game: GamesTable):
    return {
        "id": favorite.game_id,
        "statut": favorite.state or "a_decouvrir",
        "note": favorite.grade or None,
        "commentaire": favorite.opinion,
        "date_ajout": favorite.date,
        "item": {
            "id": game.id,
            "titre": game.nom,
            "categorie": game.genre,
            "description": game.description,
            "image_url": game.image,
            "annee": game.annee,
            "studio": game.studio,
            "plateforme": game.plateforme,
        },
    }


# Synchronisation conservée pour le front actuel.
def update_of_favorites(updateInfos: AccountInputUpdateFavorite, username: str, db: Session):
    check_token_name(updateInfos.name, username)
    user = db.scalars(select(UsersTable).where(UsersTable.name == username)).first()
    if user is None:
        http_exception(code=404, message="Utilisateur introuvable")

    game_ids = {game.id for game in updateInfos.favorites}
    games = db.scalars(select(GamesTable).where(GamesTable.id.in_(game_ids))).all() if game_ids else []
    if len(games) != len(game_ids):
        http_exception(code=404, message="Jeu introuvable")

    user.favorites = games
    db.commit()
    db.refresh(user)
    return {"favorites": [_favorite_response(favorite, game) for favorite, game in db.execute(
        select(UserFavorite, GamesTable)
        .join(GamesTable, UserFavorite.game_id == GamesTable.id)
        .where(UserFavorite.user_id == user.id)
    ).all()]}


# Ajout favoris

def add_favorite(updateInfos: NewFavorisInput, username: str, db: Session):
    user = db.scalars(select(UsersTable).where(UsersTable.name == username)).first()
    if user is None:
        http_exception(code=404, message="Utilisateur introuvable")

    game = db.get(GamesTable, updateInfos.item_id)
    if game is None:
        http_exception(code=404, message="Jeu introuvable")

    favorite = db.scalar(select(UserFavorite).where(
        UserFavorite.user_id == user.id,
        UserFavorite.game_id == game.id
    ))
    if favorite is not None:
        http_exception(code=409, message="Jeu déjà présent")

    favorite = UserFavorite(
        user_id=user.id,
        game_id=game.id,
        opinion=updateInfos.commentaire,
        grade=updateInfos.note or 0,
        state=updateInfos.statut,
        date=updateInfos.date_ajout
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return _entry_response(favorite, game)


# Mettre à jour un favori. L'id est le game_id, clé de l'entrée pour cet utilisateur.
def update_a_favorite(id: int, updateInfos: UpdateFavorisInput, username: str, db: Session):
    user = db.scalars(select(UsersTable).where(UsersTable.name == username)).first()
    if user is None:
        http_exception(code=404, message="Utilisateur introuvable")

    favorite = db.scalar(select(UserFavorite).where(
        UserFavorite.user_id == user.id,
        UserFavorite.game_id == id
    ))
    if favorite is None:
        http_exception(code=404, message="Veuillez mettre le jeu en favoris")

    game = db.get(GamesTable, id)
    if game is None:
        http_exception(code=404, message="Jeu introuvable")

    if "commentaire" in updateInfos.model_fields_set:
        favorite.opinion = updateInfos.commentaire
    if "note" in updateInfos.model_fields_set:
        favorite.grade = updateInfos.note or 0
    if "statut" in updateInfos.model_fields_set and updateInfos.statut is not None:
        favorite.state = updateInfos.statut
    if "date_ajout" in updateInfos.model_fields_set:
        favorite.date = updateInfos.date_ajout

    db.commit()
    db.refresh(favorite)
    return _entry_response(favorite, game)


# Supprimer un favori

def delete_a_favorite(id: int, username: str, db: Session):
    user = db.scalars(select(UsersTable).where(UsersTable.name == username)).first()
    if user is None:
        http_exception(code=404, message="Utilisateur introuvable")

    favorite = db.scalar(select(UserFavorite).where(
        UserFavorite.user_id == user.id,
        UserFavorite.game_id == id
    ))
    if favorite is None:
        http_exception(code=404, message="Le jeu n'est pas en favoris")

    db.delete(favorite)
    db.commit()


# Chercher et envoyer favoris
async def get_favoris_logic (name: str, db: Session) :
    statement = select(UsersTable).where(UsersTable.name == name)
    user = db.scalars(statement).first()
        
    if user is None :
        # Error
        http_exception(code=404, message="Utilisateur introuvable")

    statement = (select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id))
    favorites = db.execute(statement).all()

    result = []

    for favorite, game in favorites:
        game = {
            "id": favorite.game_id,
            "nom": game.nom,
            "studio": game.studio,
            "plateforme": game.plateforme,
            "annee": game.annee,
            "genre": game.genre,
            "description": game.description,
            "image": game.image,
            "opinion": favorite.opinion,
            "grade": favorite.grade,
            "state": favorite.state or "a_decouvrir",
            "date": favorite.date
        }
        result.append(game)
    return {"favorites": result}

# Sauvegarde de la note
def save_the_grade(updateInfos: SaveGradeInput, username: str, db: Session):
    # Vérif si le token appartient à l'utilisateur
    check_token_name(updateInfos.name, username)
    
    statement_user = select(UsersTable).where(UsersTable.name == updateInfos.name)
    user = db.scalars(statement_user).first()

    game = db.get(GamesTable, updateInfos.game_id)
    
    if user is None or game is None:
        # Error
        http_exception(code=404, message="Utilisateur introuvable")

    statement = select(UserFavorite).where(UserFavorite.game_id == updateInfos.game_id, UserFavorite.user_id == user.id)
    user_favo = db.scalars(statement).first()
    
    if user_favo is not None :
        if updateInfos.grade is not None:
            user_favo.grade = updateInfos.grade
        if updateInfos.opinion is not None:
            user_favo.opinion = updateInfos.opinion
        if updateInfos.state is not None:
            user_favo.state = updateInfos.state
        if updateInfos.date is not None:
            user_favo.date = updateInfos.date 
        db.commit()
        db.refresh(user_favo)
        return
    return

# Récup de la note
def get_the_grade (username: str, game_id: int, db: Session):
    statement_user = select(UsersTable).where(UsersTable.name == username)
    user = db.scalars(statement_user).first()

    statement = db.get(UserFavorite, (user.id, game_id))

    if statement is None : 
        return {"id": game_id, "opinion": "", "grade": 0, "state": "a_decouvrir", "date": None}

    return {"id": game_id, "opinion": statement.opinion, "grade": statement.grade, "state": statement.state, "date": statement.date}

# Récup des notes
def get_all_the_grade (username: str, db: Session):
    statement_user = select(UsersTable).where(UsersTable.name == username)
    user = db.scalars(statement_user).first()
    if user is None:
        # Error
        http_exception(code=404, message="Utilisateur introuvable")

    statement = (select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id))
    games = db.execute(statement).all()

    if statement is None : 
        # Error
        http_exception(code=404, message="Aucun jeu trouvé")

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