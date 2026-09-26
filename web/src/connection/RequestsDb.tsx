import {type JeuxProps} from '../interfaces/gameInt'

/* ----------------------------------
                Auth
-----------------------------------*/

interface AuthDBPropsInput {
    url: string
    setError: (value: string) => void
    dataToSend: string
}

interface AuthDBPropsOutput<T> {
    dataToResponse: T | null
}

export async function AuthDB<T>({ url, setError, dataToSend }: AuthDBPropsInput): Promise<AuthDBPropsOutput<T>> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataToSend,
        })

        const data = await response.json()

        if (!response.ok) {
            setError(data.detail)
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

interface RefrechTokenDBPropsInput {
    url: string
    token: string
}

interface RefrechTokenDBPropsOutput {
    response: string
    responseType: "Error" | "Success"
}

export async function RefrechTokenDB({ url, token }: RefrechTokenDBPropsInput): Promise<RefrechTokenDBPropsOutput> {
    try {
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'refreshToken': `Bearer ${token}`
            }
        })

        const data = await result.json()

        if (!result.ok) {
            return { responseType: "Error", response: data.detail || "Token expiré" }
        } else {
            return { responseType: "Success", response: data}
        }
    } catch {
        return { responseType: "Error", response: "Serveur indisponible" }
    }
}

/* ----------------------------------
                ME
-----------------------------------*/

interface MeDBPropsInput {
    url: string
    methodToSend: string
    token: string
    dataToSend?: string
}

interface MeDBPropsOutput<T> {
    dataToResponse: T | null
    favorites?: JeuxProps[]
    responseType: "Error" | "Success"
}

export async function MeDB<T>({ url, methodToSend, token, dataToSend }: MeDBPropsInput): Promise<MeDBPropsOutput<T>> {
    try {
        const response = await fetch(url, {
            method: methodToSend,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: dataToSend,
        })

        if (!response.ok) {
            return { dataToResponse: null, responseType: "Error" }
        } else {
            const data = await response.json()
            return { dataToResponse: data as T, favorites: data?.favorites, responseType: "Success" }
        }
    } catch {
        return { dataToResponse: null, responseType: "Error" }
    }
}


/* ----------------------------------
                Games
-----------------------------------*/

interface getGameInput {
    url: string
    setError: (value: string) => void
}

interface getGameOutput {
    dataToResponse?: JeuxProps[] | null
    dataToResponseSolo?: JeuxProps | null
}

export async function GetGamesDB({url, setError}: getGameInput): Promise<getGameOutput> {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await response.json()

        if (!response.ok) {
            setError("Le serveur a renvoyé une erreur")
            return { dataToResponse: null }
        } else {
            setError("")
            if (Array.isArray(data.games)) {
                return { dataToResponse: data.games }
            } else {
                return { dataToResponseSolo: data.game }
            }
        }
    } catch {
        setError("Serveur indisponible")
        return { dataToResponse: null }
    }
}
