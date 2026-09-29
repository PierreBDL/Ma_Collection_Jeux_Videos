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
- Noter les jeux et publier des commentaires
- Consulter des statistiques sur sa collection et ses avis
- Choisir entre un thème clair et un thème sombre

## Structure du projet

```text
Ma_Collection/
├── api/       # API FastAPI, logique métier et accès à PostgreSQL
├── web/       # Application frontend React et TypeScript
└── README.md  # Présentation générale du projet (Ce fichier)
```

## Technologies

| Partie | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS 4 |
| API | Python, FastAPI, SQLAlchemy, Uvicorn |
| Base de données | PostgreSQL |
| Authentification | Tokens JWT |

## Prérequis

- Node.js et npm
- Python 3.10 ou supérieur et pip
- Docker Desktop avec Docker Compose, ou une instance PostgreSQL accessible

## Installation et lancement

Le frontend et l'API se lancent dans deux terminaux distincts. Configurez d'abord la base de données et l'API en suivant le guide de [`api/README.md`](api/README.md).

Depuis la racine du projet, dans un premier terminal, démarrez l'API :

```powershell
cd api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi "uvicorn[standard]" sqlalchemy "psycopg[binary]" python-dotenv PyJWT passlib
```

Configurez ensuite `api/.env` selon [`api/README.md`](api/README.md), puis lancez PostgreSQL et l'API depuis le dossier `api` :

```bash
docker compose up -d
uvicorn main:app --reload
```

Dans un second terminal, lancez le frontend :

```bash
cd web
npm install
npm run dev
```

Le frontend est disponible par défaut sur [http://localhost:5173](http://localhost:5173), l'API sur [http://127.0.0.1:8000](http://127.0.0.1:8000), et sa documentation interactive sur [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## Documentation détaillée

- [Guide du frontend](web/README.md) : installation, pages et organisation de l'interface
- [Guide de l'API](api/README.md) : configuration, base de données, routes et lancement du backend
