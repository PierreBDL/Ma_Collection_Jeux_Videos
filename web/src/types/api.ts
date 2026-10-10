export type Statut = "a_decouvrir" | "en_cours" | "termine";

/* --------------------
        Register
---------------------*/

export interface RegisterResponse {
    id: number
    email: string
}

/* --------------------
        Login
---------------------*/

export interface LoginResponse {
    access_token: string
    token_type: string
}

export interface MeResponse {
    id: number
    email: string
    name: string
}

/* --------------------
      Game by id
---------------------*/

export interface GameResponse {
    id: number
    nom: string
    studio: string
    plateforme: string
    annee: string
    genre: string
    description: string
    image: string
}

export interface FavoriteGameResponse {
    id: number
    nom: string
    studio: string
    plateforme: string
    annee: string
    genre: string
    description: string
    image: string
    note: number
    commentaire: string
    etat: Statut
    date: string
}

export interface FavoritesResponse {
    favorites: FavoriteGameResponse[]
}

/* --------------------
        Favorite
---------------------*/
export interface FavoriteResponse {
    favorites: FavoriteGameResponse[]
}

// Delete
export type DeleteFavoriteResponse = null


/* --------------------
        Games
---------------------*/

export interface AllGamesResponse {
    results: GameResponse[]
    limit: number
    page: number
    total: number
}

/* --------------------
        Stats
---------------------*/
export interface StatsResponse {
    total: number
    statut: Record<Statut, number>
    console: Record<string, number>
    moyenne: number
}