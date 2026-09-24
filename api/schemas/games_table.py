from sqlalchemy.orm import Mapped, mapped_column
from schemas.base_class import Base

class GamesTable(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True)
    nom: Mapped[str]
    plateforme: Mapped[str]
    annee: Mapped[str]
    genre: Mapped[str]
    description: Mapped[str]
    etat: Mapped[str]
    note: Mapped[str]
    commentaire: Mapped[str]
    date: Mapped[str]
    image: Mapped[str]
    studio: Mapped[str]