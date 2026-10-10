from sqlalchemy.orm import Session
from sqlalchemy import select

# Table SQL
from schemas.games_table import GamesTable

# HTTP Exception
from utils.httpErrors import http_exception

##############################################################


# Compteur de pages (btn voir plus)
def counter(page: int = 1, limit: int = 12):
    # Vérif pagination
    if page < 1:
        http_exception(code=400, message="Le numéro de la page doit être de un minimum.")
    if limit < 1:
        http_exception(code=400, message="Au moins un jeu doit être affiché.")
    return {"page": page, "limit": limit}

# Page accueil
async def get_see_more(therme: str, origin: str, counterResult: dict, db: Session):
    term = therme.strip().lower()
    categorie = origin.strip().lower()
    page = counterResult["page"]
    limit = counterResult["limit"]

    statement = db.scalars(select(GamesTable).order_by(GamesTable.id)).all()

    # Recherche / filtre
    result = []
    for i in statement:
        if term and term not in i.nom.lower():
            ok = False
        if categorie and categorie != i.genre.lower() and categorie not in i.plateforme.lower():
            ok = False

        if ok == True :
            # Result
            game = {
                "id": i.id,
                "titre": i.nom,
                "categorie": i.genre,
                "studio": i.studio,
                "plateforme": i.plateforme,
                "annee": int(i.annee),
                "description": i.description,
                "image_url": "/images/" + i.image
            }
            result.append(game)
        
        # Result
        page_precedente = page - 1

    return {
        "results": result[page_precedente * limit : page * limit],
        "limit": limit,
        "total": len(result),
        "page": page,
    }

# Jeu par id
def get_by_id(id: int, db: Session):
    game_bdd = db.get(GamesTable, id)
    if game_bdd is None:
        http_exception(code=404, message="Jeu introuvable")
    return {
        "id": game_bdd.id,
        "titre": game_bdd.nom,
        "categorie": game_bdd.genre,
        "studio": game_bdd.studio,
        "plateforme": game_bdd.plateforme,
        "annee": game_bdd.annee,
        "description": game_bdd.description,
        "image_url": game_bdd.image
    }
