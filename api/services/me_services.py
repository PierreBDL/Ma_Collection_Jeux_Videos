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
        # Error
        http_exception(code=401, message="Token invalide")
    return

# Ajout favoris
def add_favorite(updateInfos: NewFavorisInput, username: str, db: Session):
    
    # Vérif si l'utilisateur existe dans la bdd
    user = db.scalars(select(UsersTable).where(UsersTable.name == username)).first()
    if user is None:
        # Error
        http_exception(code=404, message="Utilisateur introuvable")

    # Chercher le jeu
    game = db.get(GamesTable, updateInfos.item_id)
    if game is None:
        # Error
        http_exception(code=404, message="Jeu introuvable")

    # Vérif si le jeu est déjà favoris
    isFavorite = db.scalars(select(UserFavorite).where(UserFavorite.user_id == user.id, UserFavorite.game_id == updateInfos.item_id)).first()
    if isFavorite is not None:
        # Error
        http_exception(code=409, message="Jeu déjà présent")

    # Récup la liste actuelle
    statement = db.execute(select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id)).all()
    
    # Résultat
    result = []
    for favoris, i in statement:
        old_game = {
            "id": i.id,
            "nom": i.nom,
            "studio": i.studio,
            "plateforme": i.plateforme,
            "annee": i.annee,
            "genre": i.genre,
            "description": i.description,
            "image": i.image,
            "etat": favoris.state or "a_decouvrir",
            "note": favoris.grade or 0,
            "commentaire": favoris.opinion or "",
            "date": favoris.date or "",
        }
        result.append(old_game)
        
    # Nouveau jeu
    new_game = {
        "id": game.id,
        "nom": game.nom,
        "studio": game.studio,
        "plateforme": game.plateforme,
        "annee": game.annee,
        "genre": game.genre,
        "description": game.description,
        "image": game.image,
        "etat": updateInfos.state or "a_decouvrir",
        "note": updateInfos.grade or 0,
        "commentaire": updateInfos.opinion or "",
        "date": updateInfos.date or "",
    }
    result.append(new_game)
    
    # Nouveau Favorite
    favorite = UserFavorite(
        user_id=user.id,
        game_id=game.id,
        state=updateInfos.state,
        grade=updateInfos.grade or 0,
        opinion=updateInfos.opinion or "",
        date=updateInfos.date or None
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    
    return {"favorites": result}


# MAJ Favorite
def update_a_favorite(entry_id: int, updateInfos: UpdateFavorisInput, username: str, db: Session):
    # Vérif si l'utilisateur existe dans la bdd
    user = db.scalars(select(UsersTable).where(UsersTable.name == username)).first()
    if user is None:
        # Error
        http_exception(code=404, message="Utilisateur introuvable")

    # Vérif si le jeu est favoris
    favorite = db.scalars(select(UserFavorite).where(UserFavorite.user_id == user.id, UserFavorite.game_id == entry_id)).first()
    if favorite is None:
        # Error
        http_exception(code=404, message="Le jeu n'est pas en favoris")

    # MAJ des infos
    if updateInfos.state is not None:
        favorite.state = updateInfos.state
    if updateInfos.grade is not None:
        favorite.grade = updateInfos.grade
    if updateInfos.opinion is not None:
        favorite.opinion = updateInfos.opinion
    if updateInfos.date is not None:
        favorite.date = updateInfos.date

    db.commit()
    db.refresh(favorite)

    # Récup la liste actuelle
    statement = db.execute(select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id)).all()

    # Résultat
    result = []
    for favoris, i in statement:
        game = {
            "id": i.id,
            "nom": i.nom,
            "studio": i.studio,
            "plateforme": i.plateforme,
            "annee": i.annee,
            "genre": i.genre,
            "description": i.description,
            "image": i.image,
            "etat": favoris.state or "a_decouvrir",
            "note": favoris.grade or 0,
            "commentaire": favoris.opinion or "",
            "date": favoris.date or "",
        }
        result.append(game)
    return {"favorites": result}


# Delete Favorite
def delete_a_favorite(entry_id: int, username: str, db: Session):
    # Vérif si l'utilisateur existe dans la bdd
    user = db.scalars(select(UsersTable).where(UsersTable.name == username)).first()
    if user is None:
        # Error
        http_exception(code=404, message="Utilisateur introuvable")

    # Vérif si le jeu est favoris
    favorite = db.get(UserFavorite, (user.id, entry_id))
    if favorite is None:
        # Error
        http_exception(code=404, message="Le jeu n'est pas en favoris")

    db.delete(favorite)
    db.commit()

# Chercher et envoyer les favoris
async def get_favoris_logic(statut, tri, name: str, db: Session):
    # Vérif si l'utilisateur existe dans la bdd
    user = db.scalars(select(UsersTable).where(UsersTable.name == name)).first()
    if user is None:
        # Error
        http_exception(code=404, message="Utilisateur introuvable")

    # Filtre et tri
    if statut is not None and tri is not None and statut != "tous":
        if tri == "date":
            statement = select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id, UserFavorite.state == statut).order_by(UserFavorite.date.asc())
        elif tri == "note":
            statement = select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id, UserFavorite.state == statut).order_by(UserFavorite.grade.asc())
        else:
            statement = select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id, UserFavorite.state == statut)
    elif statut is not None and statut != "tous":
        statement = select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id, UserFavorite.state == statut)
    elif tri == "date":
        statement = select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id).order_by(UserFavorite.date.asc())
    elif tri == "note":
        statement = select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id).order_by(UserFavorite.grade.asc())
    else :
        statement = select(UserFavorite, GamesTable).join(GamesTable, UserFavorite.game_id == GamesTable.id).where(UserFavorite.user_id == user.id)
    
    favorites = db.execute(statement).all()

    # Résultat
    result = []
    for favoris, i in favorites:
        game = {
            "id": i.id,
            "nom": i.nom,
            "studio": i.studio,
            "plateforme": i.plateforme,
            "annee": i.annee,
            "genre": i.genre,
            "description": i.description,
            "image": i.image,
            "etat": favoris.state or "a_decouvrir",
            "note": favoris.grade or 0,
            "commentaire": favoris.opinion or "",
            "date": favoris.date or "",
        }
        result.append(game)
    return {"favorites": result}


def get_stats(username: str, db: Session):
    
    # Vérif si l'utilisateur existe dans la bdd
    user = db.scalars(select(UsersTable).where(UsersTable.name == username)).first()
    if user is None:
        # Error
        http_exception(code=404, message="Utilisateur introuvable")

    # récup favoris avec les jeux pour obtenir leur plateforme
    favorites = db.execute(
        select(UserFavorite, GamesTable)
        .join(GamesTable, UserFavorite.game_id == GamesTable.id)
        .where(UserFavorite.user_id == user.id)
    ).all()
    
    # Varriables
    statut = {"a_decouvrir": 0, "en_cours": 0, "termine": 0}
    console = {"PC": 0, "PlayStation": 0, "Nintendo": 0}
    notes = []

    # Chercher
    for favorite, game in favorites:
        state = favorite.state or "a_decouvrir"
        if state in statut:
            statut[state] += 1

        platform = game.plateforme.lower()
        if "pc" in platform or "windows" in platform:
            console["PC"] += 1
        elif "playstation" in platform:
            console["PlayStation"] += 1
        elif "nintendo" in platform:
            console["Nintendo"] += 1

        if favorite.grade is not None and favorite.grade > 0:
            notes.append(favorite.grade)

    
    # Moyenne
    moyenne = sum(notes) / len(notes) if notes else 0
    
    return {
        "total": len(favorites),
        "statut": statut,
        "console": console,
        "moyenne": moyenne
    }

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
