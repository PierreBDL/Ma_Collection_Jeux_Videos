from sqlalchemy.orm import Session
from sqlalchemy import func, select
from schemas.games_table import GamesTable
from utils.httpErrors import http_exception

def counter(page: int = 1, limit: int = 12):
    if page == 1 :
       return {"page": 0, "limit": limit} 
    return {"page": page, "limit": limit}

async def get_see_more(therme: str, origin: str, counterResult: dict, db: Session):
    term = therme.strip().lower()
    page = counterResult["page"]
    limit = counterResult["limit"]
    total = page * limit
    
    if term is None or term == "":
        statement = select(GamesTable).offset(page * limit).limit(limit)
        jeux_bdd = db.scalars(statement).all()

        # Error
        http_exception(code=404, message="Aucun jeu")

        # Result
        result = []
                
        for i in jeux_bdd :
            game = {
                "id": i.id,
                "nom": i.nom,
                "studio": i.studio,
                "plateforme": i.plateforme,
                "annee": i.annee,
                "genre": i.genre,
                "description": i.description,
                "image": i.image
            }
            result.append(game)

        return {
            "results": result,
            "limit": limit,
            "total": total + len(result),
            "page": page,
        }
    else :
        statement = db.scalars(select(GamesTable)).all()
        
        if statement is None:
            return {
                "results": [],
                "limit": limit,
                "total": 0,
                "page": page,
            }
        
        # Result
        result = []
        
        # Recherche
        if origin == "bySearchBar":
            for i in statement:
                if term in i.nom.lower():
                    game = {
                        "id": i.id,
                        "nom": i.nom,
                        "studio": i.studio,
                        "plateforme": i.plateforme,
                        "annee": i.annee,
                        "genre": i.genre,
                        "description": i.description,
                        "image": i.image
                    }
                    result.append(game)
            return {
                "results": result[page * limit : page * limit + limit],
                "limit": limit,
                "total": total + len(result),
                "page": (total / limit),
            }
        
        if origin == "byFilters":
            for i in statement:
                if term in i.genre.lower() or term in i.plateforme.lower():
                    result.append(i)
            return {
                "results": result[page * limit : page * limit + limit],
                "limit": limit,
                "total": total,
                "page": (total / limit),
            }
        
        return {
            "results": [],
            "limit": limit,
            "total": 0,
            "page": (total / limit),
        }

# Jeu par id
def get_by_id (id: int, db: Session):
    statement = db.get(GamesTable, id)
    if statement is None:
        http_exception(code=404, message="Jeu introuvable")
    return statement