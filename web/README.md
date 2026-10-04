  # Ma Collection - Frontend

  Application web de gestion d'une collection de jeux vidéo, développée avec React et TypeScript. Le frontend permet de découvrir les jeux disponibles, de consulter leurs informations, puis de gérer ses favoris et ses avis depuis un compte utilisateur.

  ## Fonctionnalités

  - Catalogue de jeux récupéré depuis l'API, avec chargement progressif par lots de 12 jeux
  - Recherche par nom et filtres par genre ou plateforme
  - Fiche détaillée d'un jeu : studio, plateforme, genre, année et description
  - Création de compte et connexion
  - Ajout et retrait de jeux favoris, synchronisés avec le compte
  - Consultation et filtrage de sa bibliothèque personnelle par statut : à découvrir, en cours ou terminé
  - Possibilité de mettre un status (à découvrir, en cours ou terminé) une note et un commentaire, avec affichage de la date de mise à jour
  - Page de statistiques sur la collection et les avis
  - Thème clair et sombre
  - Bouton pour revenir en haut de la page

  ## Stack technique

  | Partie | Technologie |
  |---|---|
  | Interface | React, TypeScript, HTML et CSS |
  | Développement local | Vite |
  | Styles | Tailwind CSS 4 |
  | Navigation | React Router |
  | API | Backend Python avec FastAPI |
  | Base de données | PostgreSQL, via l'API |

  ## Prérequis

  - Node.js et npm
  - L'API Python du projet en cours d'exécution
  - PostgreSQL configuré et accessible par l'API

  ## Installation et lancement

  Depuis le dossier Ma_Collection :

  ```bash
  cd web
  npm install
  npm run dev
  ```

  Vite affiche l'adresse locale dans le terminal. Par défaut, l'application est disponible sur [http://localhost:5173](http://localhost:5173).

  Le frontend appelle l'API à l'adresse `http://127.0.0.1:8000`. Démarrez et configurez l'API avant d'utiliser le catalogue, l'authentification ou les données de compte. La configuration de la base de données et les variables d'environnement sont à renseigner côté `api`.

  ## Parcours dans l'application

  | Page | Adresse | Description |
  |---|---|---|
  | Accueil | `/` | Parcourir, rechercher et filtrer les jeux |
  | Inscription | `/register` | Créer un compte |
  | Connexion | `/login` | Se connecter à son compte |
  | Détails d'un jeu | `/details/:id` | Consulter un jeu, le mettre en favori et gérer son avis et son statut |
  | Ma bibliothèque | `/myLibrary` | Retrouver les jeux favoris du compte connecté et les filtrer par statut |
  | Statistiques | `/stats` | Voir les données de collection et les avis |

  ## Structure du frontend

  ```text
  web/
  ├── public/images/        # Images des jeux
  └── src/
      ├── components/       # Composants d'interface réutilisables
      ├── connection/       # Requêtes vers l'API
      ├── context/          # Contexte d'authentification
      ├── hooks/            # Hooks de thème et de stockage local
      ├── interfaces/       # Interfaces TypeScript
      ├── pages/            # Pages associées aux routes
      ├── types/            # Types et options de recherche
      └── utils/            # Configuration et utilitaires
  ```

  ## Scripts disponibles

  | Commande | Action |
  |---|---|
  | `npm run dev` | Démarrer le serveur de développement Vite |
