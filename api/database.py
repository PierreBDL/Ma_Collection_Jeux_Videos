from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Mapped, mapped_column, DeclarativeBase, Session
from data.game_data import *
from fastapi import Depends
from schemas.base_class import Base
from schemas.games_table import GamesTable

# Charger env
from dotenv import load_dotenv
import os
load_dotenv()

URL_DB = os.getenv("DATABASE_URL")

# Création de l'entrée de la bdd
engine = create_engine(URL_DB)
SessionLocal = sessionmaker(bind=engine)

# Tables
class UsersTable(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    email: Mapped[str]
    password: Mapped[str]

# Créer les tables
Base.metadata.create_all(engine)

# Methode pour communiquer avec la bdd
def get_db():
    db = SessionLocal()

    try :
        yield db
    finally:
        db.close()

# Remplir la bdd
def fill_bdd ():
    db = next(get_db())
    
    try:
        statement = select(GamesTable)
        if db.scalars(statement).first() is not None:
            return

        for i in jeux:
            game = GamesTable(
                id=i["id"],
                nom=i["nom"],
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

