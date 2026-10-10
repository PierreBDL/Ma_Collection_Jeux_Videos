# Ma Collection

Application web de gestion d'une collection de jeux vidéo, réalisée dans le cadre d'un projet de deuxième année (B2). Elle permet de parcourir un catalogue, de conserver ses jeux favoris et de partager des notes et des commentaires.

Le projet est composé d'un frontend en React et TypeScript, d'une API en Python avec FastAPI et d'une base de données PostgreSQL.

---

## Fonctionnalités

- Parcourir et rechercher des jeux dans le catalogue
- Filtrer les jeux par genre et par plateforme
- Consulter la fiche détaillée d'un jeu
- Créer un compte et se connecter
- Gérer sa bibliothèque de jeux favoris
- Filtrer sa bibliothèque par statut : à découvrir, en cours ou terminé
- Noter les jeux, publier des commentaires et consulter la date de mise à jour
- Consulter des statistiques sur sa collection et ses avis
- Choisir entre un thème clair et un thème sombre
- Revenir en haut de la page avec un bouton

## Structure du projet

```text
Ma_Collection/
    ├── README.md (Ce fichier)
    ├── api/
    └── web/

```

Plus d'infos :

[![Architecture diagram of pierrebdl/ma_collection_jeux_videos](https://gitdiagram.com/pierrebdl/ma_collection_jeux_videos/diagram.png)](https://gitdiagram.com/pierrebdl/ma_collection_jeux_videos?utm_source=readme&utm_medium=picture)

## Technologies

| Partie | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS 4 |
| API | Python, FastAPI, SQLAlchemy, Uvicorn |
| Base de données | PostgreSQL |
| Authentification | Tokens JWT |

## Prérequis

- Node.js 22.12+ et npm
- Python 3.10 ou supérieur et pip
- Docker Desktop avec Docker Compose, ou une instance PostgreSQL accessible

## Installation et lancement

Le Frontend et l'API se lancent dans deux terminaux distincts. 

- ### Serveur (API) (Plus d'infos: [`Guide de l'API`](api/README.md))

Déplacement et installation des dépendances:

```powershell
cd api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi "uvicorn[standard]" sqlalchemy "psycopg[binary]" python-dotenv PyJWT passlib pydantic[email]
```

Créez et configurez ensuite `api/.env` comme l'exemple .env.example

Lancez PostgreSQL et l'API depuis le dossier `api` :

```bash
docker compose up -d ; uvicorn main:app --reload
```

- ### Frontend (Plus d'infos: [`Guide du frontend`](web/README.md))

Déplacement et lancement :

```bash
cd web
npm install ; npm run dev
```

- ### Résultat

  - Le frontend : [http://localhost:5173](http://localhost:5173)
  - L'API sur [http://127.0.0.1:8000](http://127.0.0.1:8000)
  - Documentation de l'API sur [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## Documentation détaillée

- [Guide du frontend](web/README.md) : installation, pages et organisation de l'interface
- [Guide de l'API](api/README.md) : configuration, base de données, routes et lancement du backend


## Bugs connus
- Les refresh tokens peuvent ne pas fonctionner