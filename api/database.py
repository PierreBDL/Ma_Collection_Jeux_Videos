from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Mapped, mapped_column, DeclarativeBase, Session
from data.game_data import *
from fastapi import Depends
from schemas.base_class import Base

from schemas.games_table import GamesTable
from schemas.users_table import UsersTable
from schemas.users_favorites_table import UserFavorite

# Charger env
from dotenv import load_dotenv
import os
load_dotenv()

URL_DB = os.getenv("DATABASE_URL")

# Création de l'entrée de la bdd
engine = create_engine(URL_DB)
SessionLocal = sessionmaker(bind=engine)

# Créer les tables
Base.metadata.create_all(engine)

# Methode pour communiquer avec la bdd
def get_db():
    db = SessionLocal()

    try :
        yield db
    finally:
        db.close()