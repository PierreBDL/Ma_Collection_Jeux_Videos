from sqlalchemy.orm import Session
from sqlalchemy import select
from schemas.games_table import GamesTable

def counter(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

def get_see_more (counterResult: dict, db: Session):
    statement = select(GamesTable).offset(counterResult["skip"]).limit(counterResult["limit"])
    jeux_bdd = db.scalars(statement).all()
    return jeux_bdd