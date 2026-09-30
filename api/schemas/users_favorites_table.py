from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from schemas.base_class import Base

class UserFavorite(Base):
    __tablename__ = "user_favorites"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), primary_key=True)
    opinion: Mapped[str | None] = mapped_column(Text, nullable=True)
    grade: Mapped[int | None] = mapped_column(nullable=True)
    state: Mapped[str] = mapped_column(nullable=True)