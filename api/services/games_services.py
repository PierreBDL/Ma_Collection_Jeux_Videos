from sqlalchemy.orm import Session
from sqlalchemy import func, select
from fastapi import Query
from schemas.games_table import GamesTable
from utils.httpErrors import http_exception


def counter(page: int = Query(1, ge=1), limit: int = Query(12, ge=1)):
    return {"page": (page - 1) * limit, "limit": limit}


async def get_see_more(therme: str, origin: str, counterResult: dict, db: Session):
    skip = counterResult["page"]
    limit = counterResult["limit"]
    therme = (therme or "").strip().lower()

    if not therme:
        statement = select(GamesTable).order_by(GamesTable.id).offset(skip).limit(limit)
        games = db.scalars(statement).all()
        total = db.scalar(select(func.count()).select_from(GamesTable))
    else:
        all_games = db.scalars(select(GamesTable).order_by(GamesTable.id)).all()
        if origin == "bySearchBar":
            result = [game for game in all_games if therme in game.nom.lower()]
        elif origin == "byFilters":
            result = [
                game for game in all_games
                if therme in game.genre.lower() or therme in game.plateforme.lower()
            ]
        else:
            result = []
        total = len(result)
        games = result[skip:skip + limit]

    return {
        "results": [game.__dict__ for game in games],
        "limit": limit,
        "total": total,
        "page": (total + limit - 1) // limit,
        "skip": skip,
    }


# Jeu par id
def get_by_id(id: int, db: Session):
    statement = db.get(GamesTable, id)
    if statement is None:
        http_exception(code=404, message="Jeu introuvable")
    return statement


