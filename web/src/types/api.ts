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