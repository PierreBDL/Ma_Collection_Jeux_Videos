from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker, Mapped, mapped_column, DeclarativeBase, Session

# Classe de base
class Base(DeclarativeBase):
    pass
