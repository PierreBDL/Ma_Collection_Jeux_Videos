type Statut = "a_decouvrir" | "en_cours" | "termine";

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
