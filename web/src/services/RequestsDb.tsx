import { type JeuxProps } from '../interfaces/gameInt'
import type * as DbTypes from '../types/DbTypes'

/* ----------------------------------
                Auth
-----------------------------------*/

export async function AuthDB<T>({ url, setError, dataToSend }: DbTypes.AuthDBPropsInput): Promise<DbTypes.AuthDBPropsOutput<T>> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: dataToSend,
        })

        const data = await response.json()

        if (!response.ok) {
            let reponse;
            data !== null && data.detail && data.detail !== undefined && data.detail !== null ? reponse = data.detail : reponse = "Erreur lors de la requête au serveur"
            
            setError(reponse)
            return { dataToResponse: null }
        } else if (data === null) {
            setError("Erreur lors de la requête au serveur")
            return { dataToResponse: null }
        } else {
            setError("")
            return { dataToResponse: data as T }
        }
    } catch {
        setError("Serveur indisponible")
        return { dataToResponse: null }
    }
}

export async function RefrechTokenDB({ url, token }: DbTypes.RefrechTokenDBPropsInput): Promise<DbTypes.RefrechTokenDBPropsOutput> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'refreshToken': `Bearer ${token}`}
        })

        const data = await response.json()

        if (!response.ok) {
            let reponse;
            data !== null && data.detail && data.detail !== undefined && data.detail !== null ? reponse = data.detail : reponse = "Token expiré"
            return { responseType: "Error", response: reponse }
        } else {
            return { responseType: "Success", response: data }
        }
    } catch {
        return { responseType: "Error", response: "Serveur indisponible" }
    }
}

/* ----------------------------------
                ME
-----------------------------------*/

export async function MeDB<T>({ url, methodToSend, token, dataToSend }: DbTypes.MeDBPropsInput): Promise<DbTypes.MeDBPropsOutput<T>> {
    try {
        const response = await fetch(url, {
            method: methodToSend,
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: dataToSend,
        })

        // Delete
        if (response.status === 204) {
            return { dataToResponse: null, responseType: "Success" }
        }

        const data = await response.json().catch(() => null)

        let reponse;
        data !== null && data.detail && data.detail !== undefined && data.detail !== null ? reponse = data.detail : reponse = "Erreur lors de la connexion au serveur"

        if (!response.ok) {
            return { dataToResponse: null, responseType: "Error", error: reponse }
        } else if (data === null) {
            return { dataToResponse: null, responseType: "Error", error: reponse }
        } else {
            return {
                dataToResponse: data as T,
                favorites: data?.favorites?.map((favorite: {item: JeuxProps, opinion: string, grade: number, state: JeuxProps["state"], date: string}) => ({
                    id: favorite.item.id,
                    nom: favorite.item.nom,
                    image: favorite.item.image,
                    studio: favorite.item.studio,
                    plateforme: favorite.item.plateforme,
                    annee: favorite.item.annee,
                    genre: favorite.item.genre,
                    description: favorite.item.description,
                    opinion: favorite.opinion,
                    grade: favorite.grade,
                    state: favorite.state,
                    date: favorite.date
                })), responseType: "Success"}
        }
    } catch {
        return { dataToResponse: null, responseType: "Error", error: "Serveur indisponible" }
    }
}

/* ----------------------------------
                Games
-----------------------------------*/

export async function GetGamesDB<T>({ url, setError }: DbTypes.getGameInput): Promise<DbTypes.getGameOutput<T>> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        const data = await response.json()

        if (!response.ok) {
            setError(data?.erreur?.message ?? data?.detail ?? "Le serveur a renvoyé une erreur")
            return { dataToResponse: null }
        } else {
            setError("")

            // Regarder si il y a une clé page
            let isPageKey = false
            for (let i = 0; i < Object.keys(data).length; i++) {
                if (Object.keys(data)[i] === "page") {
                    isPageKey = true
                }
            }

            if (isPageKey) {
                return { dataHomePage: data as T }
            } else if (Array.isArray(data.games)) {
                return { dataToResponse: data.games as T[] }
            } else {
                return { dataToResponseSolo: (data.game ?? data) as T }
            }
        }
    } catch {
        setError("Serveur indisponible")
        return { dataToResponse: null }
    }
}
