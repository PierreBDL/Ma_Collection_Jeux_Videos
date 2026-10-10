
from schemas.games_table import GamesTable
from sqlalchemy import select

# BDD
from database import get_db

# Données des jeux
from data.game_data import jeux

##############################################################

# Remplir la bdd
def fill_bdd ():
    # Création d'une session temporaire pour remplir la bdd
    db = next(get_db())
    
    try:
        # Regarder s'il y a un jeu et remplir s'il n'y en a pas
        statement = select(GamesTable)
        if db.scalars(statement).first() is not None:
            return

        for i in jeux:
            game = GamesTable(
                id=i["id"],
                nom=i["nom"],
                image=i["image"],
                studio=i["studio"],
                plateforme=i["plateforme"],
                annee=i["annee"],
                genre=i["genre"],
                description=i["description"],
                etat="a_decouvrir",
                note=0,
                commentaire="",
                date="",
            )
            db.add(game)
        
        db.commit()
    finally:
        db.close()

