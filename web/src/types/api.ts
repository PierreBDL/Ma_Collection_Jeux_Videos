export type Statut = "a_decouvrir" | "en_cours" | "termine";

import {type JeuxProps} from '../interfaces/gameInt'

/* --------------------
        Register
---------------------*/

export interface RegisterResponse {
    access_token: string
    refresh_token: string
    token_type: string
    id: number
    email: string
    name: string
    favorites: JeuxProps[] | []
}

/* --------------------
        Login
---------------------*/

export interface LoginResponse {
    access_token: string
    refresh_token: string
    name: string
    favorites: JeuxProps[]
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
    opinion?: string
    grade?: number
    state?: "a_decouvrir" | "en_cours" | "termine"
    date?: string
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
    results: JeuxProps[]
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