  # Ma Collection - Frontend

  Application web de gestion d'une collection de jeux vidéo, développée avec React et TypeScript. Le frontend permet de découvrir les jeux disponibles, de consulter leurs informations, puis de gérer ses favoris et ses avis depuis un compte utilisateur.

  ## Fonctionnalités

  - Catalogue de jeux récupéré depuis l'API, avec chargement progressif par lots de 12 jeux
  - Recherche par nom et filtres par genre ou plateforme
  - Fiche détaillée d'un jeu : studio, plateforme, genre, année et description, etc
  - Création de compte et connexion
  - Ajout et retrait de jeux favoris, synchronisés avec le compte
  - Consultation et filtrage de sa bibliothèque personnelle par statut : à découvrir, en cours ou terminé ou trier par date ou par note
  - Possibilité de mettre un statut (à découvrir, en cours ou terminé) une note et un commentaire, avec affichage de la date de mise à jour
  - Page de statistiques sur la collection et les avis
  - Thème clair et sombre
  - Bouton pour revenir en haut de la page

  ## Stack technique

  | Partie | Technologie |
  |---|---|
  | Interface | HTML, JSX |
  | CSS | Tailwind CSS 4 |
  | Logique | TypeScript, React |

  ## Prérequis

  - Node.js 22.12+ et npm
  - L'API Python du projet en cours d'exécution
  - PostgreSQL configuré et accessible par l'API

  ## Installation et lancement

  Depuis le dossier Ma_Collection :

  ```bash
  cd web
  npm install
  npm run dev
  ```

  Accéder au site : [http://localhost:5173](http://localhost:5173).

  Veuillez démarrer le serveur via le [`tutoriel API`](../api/README.md).

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
      ├── components/       # Composants d'interface
      ├── hooks/            # Hooks de thème et de stockage local
      ├── interfaces/       # Interfaces TypeScript
      ├── pages/            # Pages associées aux routes
      ├── types/            # Types et options de recherche
      └── utils/            # Utilitaires
  ```

  ## Scripts disponibles

  | Commande | Action |
  |---|---|
  | `npm run dev` | Démarrer le serveur de développement Vite |
