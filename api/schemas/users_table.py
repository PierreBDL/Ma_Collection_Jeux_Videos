from sqlalchemy.orm import Mapped, mapped_column, relationship
from schemas.base_class import Base
from models.game_model import Game
from schemas.users_favorites_table import UserFavorite

class UsersTable(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    email: Mapped[str]
    password: Mapped[str]
    favorites: Mapped[list["Game"]] = relationship("GamesTable", secondary=UserFavorite.__table__)