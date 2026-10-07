from sqlalchemy.orm import Session
from sqlalchemy import func, select
from schemas.games_table import GamesTable
from utils.httpErrors import http_exception

def counter(skip: int = 0, limit: int = 12):
    return {"skip": skip, "limit": limit}

def get_see_more(counterResult: dict, db: Session):
    statement = select(GamesTable).offset(counterResult["skip"]).limit(counterResult["limit"])
    jeux_bdd = db.scalars(statement).all()
    total = db.scalar(select(func.count()).select_from(GamesTable))
    return {
        "games": jeux_bdd,
        "limit": counterResult["limit"],
        "total": total,
        "skip": counterResult["skip"],
    }

def get_see_more_research(therme: str, origin: str, counterResult: dict, db: Session):
    statement = db.scalars(select(GamesTable)).all()

    if statement is None:
        return {"games": []}

    # Result
    result = []

    # Pas de recherche
    if therme is None or therme == "":
        for i in statement[counterResult["skip"]:counterResult["skip"] + counterResult["limit"]]:
            result.append(i)
        return {"games": result}

    # Recherche
    therme = therme.strip().lower()
    if origin == "bySearchBar":
        for i in statement:
            if therme in i.nom.lower():
                result.append(i)
        return {"games": result[counterResult["skip"]:counterResult["skip"] + counterResult["limit"]]}

    if origin == "byFilters":
        for i in statement:
            if therme in i.genre.lower() or therme in i.plateforme.lower():
                result.append(i)
        return {"games": result[counterResult["skip"]:counterResult["skip"] + counterResult["limit"]]}

    return {"games": []}

# Jeu par id
def get_by_id (id: int, db: Session):
    statement = db.get(GamesTable, id)
    if statement is None:
        http_exception(code=404, message="Jeu introuvable")
    return statement