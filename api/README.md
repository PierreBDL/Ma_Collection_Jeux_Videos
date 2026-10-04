# Ma Collection - API

API de l'application **Ma Collection**, une application de gestion d'une collection de jeux vidéo. Développée avec FastAPI et SQLAlchemy, elle fournit le catalogue des jeux et les fonctionnalités de compte, de favoris et d'avis.

---

### Vue d'ensemble

L'API communique avec une base PostgreSQL et est utilisée par le frontend React situé dans le dossier `web/`. Au démarrage, les tables sont créées si nécessaire et le catalogue de jeux est inséré automatiquement lorsque la table est vide.

La documentation interactive des routes est disponible dans Swagger UI à l'adresse `http://127.0.0.1:8000/docs` une fois l'API démarrée.

### Fonctionnalités

- Consultation du catalogue avec pagination
- Consultation des informations détaillées d'un jeu
- Création de compte et connexion
- Émission de token d'accès et de refresh
- Gestion des jeux favoris d'un compte
- Enregistrement et consultation des notes et commentaires
- Création automatique des tables et initialisation du catalogue

### Routes principales

| Méthode | Route | Description | Authentification |
|---|---|---|---|
| `GET` | `/games` | Récupérer une page du catalogue (`skip`, `limit`; limite par défaut : 10) | Non |
| `GET` | `/games/{game_id}` | Récupérer la fiche d'un jeu | Non |
| `POST` | `/auth/register` | Créer un compte et obtenir un token | Non |
| `POST` | `/auth/login` | Se connecter et obtenir un token | Non |
| `POST` | `/auth/refresh` | Refresh le token d'accès | token de refresh dans le header `refreshToken` |
| `PUT` | `/me/updateFavorite` | Mettre à jour les favoris | Oui |
| `POST` | `/me/collection` | Récupérer les favoris du compte | Oui |
| `PUT` | `/me/saveGrade` | Enregistrer une note et un commentaire | Oui |
| `GET` | `/me/getGrade` | Récupérer l'avis du compte pour un jeu (`game_id`) | Oui |
| `GET` | `/me/getAllGrade` | Récupérer tous les avis du compte | Oui |

Les routes `/me` attendent un token d'accès au format bearer dans le header `Authorization`. Les détails des paramètres et des formats de réponse sont disponibles dans Swagger UI.

### Stack technique

| Partie | Technologie |
|---|---|
| API | Python, FastAPI, Uvicorn |
| Accès aux données | SQLAlchemy |
| Base de données | PostgreSQL 16 |
| Authentification | JWT et hachage des mots de passe |
| Configuration | Variables d'environnement avec `python-dotenv` |

### Prérequis

- Python 3.10 ou supérieur
- Docker Desktop avec Docker Compose, ou une instance PostgreSQL accessible
- `pip`

### Installation et lancement

Depuis le dossier `Ma_Collection` :

1. Placez-vous dans le dossier de l'API et créez un environnement virtuel :

	```powershell
	cd api
	python -m venv .venv
	.\.venv\Scripts\Activate.ps1
	```

2. Installez les dépendances utilisées par l'API :

	```bash
	python -m pip install fastapi "uvicorn[standard]" sqlalchemy "psycopg[binary]" python-dotenv PyJWT passlib
	```

3. Configurez les variables d'environnement dans `api/.env` comme montré dans `api/.env.example`.

4. Démarrez PostgreSQL avec Docker Compose, depuis le dossier `api` :

	```bash
	docker compose up -d
	```

5. Démarrez l'API, toujours depuis `api` :

	```bash
	uvicorn main:app --reload
	```

L'API est alors accessible sur `http://127.0.0.1:8000`. Pour arrêter PostgreSQL, utilisez `docker compose down` depuis `api`.

### Configuration

Créez `api/.env` à partir de `api/.env.example`, puis renseignez les variables. Les mêmes valeurs de base de données (`DB_NAME`, `DB_USER`, `DB_PASSWORD` et `PORT`) sont utilisées par Docker Compose et doivent correspondre à l'URL SQLAlchemy :

```dotenv
DB_USER=username
DB_PASSWORD=mdp_bdd
DB_NAME=nom_bdd
PORT=port

DATABASE_URL=postgresql+psycopg://username:mdp_bdd@localhost:port/nom_bdd

SECRET=mettre_cle
ALGORITHM=mettre_algorithme
PWD_ALGORITHM=mettre_algorithme
```

### Connexion au frontend

Le frontend Vite est configuré pour utiliser l'API sur `http://127.0.0.1:8000`. Le backend autorise les origines `http://localhost:5173` et `http://127.0.0.1:5173` pour les requêtes.

### Structure du projet

```text
api/
├── main.py                 # Application FastAPI, CORS et routers
├── database.py             # Connexion SQLAlchemy et sessions
├── docker-compose.yml      # Configuration de PostgreSQL
├── data/                   # Données du catalogue et initialisation
├── models/                 # Modèles des données python
├── routers/                # Routes auth, me et games
├── schemas/                # Tables SQLAlchemy
├── security/               # Vérification et création des tokens
└── services/               # Logique métier
```

### Scripts et commandes

| Commande | Action |
|---|---|
| `docker compose up -d` | Démarrer PostgreSQL en arrière-plan |
| `uvicorn main:app --reload` | Démarrer l'API avec rechargement automatique |
| `docker compose down` | Arrêter le service PostgreSQL |

---
