import type { JeuxProps } from '../interfaces/gameInt'

/* ----------------------------------
                Auth
-----------------------------------*/

export interface AuthDBPropsInput {
    url: string
    setError: (value: string) => void
    dataToSend: string
}

export interface AuthDBPropsOutput<T> {
    dataToResponse: T | null
}

/* ----------------------------------
              Refresh
-----------------------------------*/

export interface RefrechTokenDBPropsInput {
    url: string
    token: string
}

export interface RefrechTokenDBPropsOutput {
    response: string
    responseType: "Error" | "Success"
}

/* ----------------------------------
                ME
-----------------------------------*/

export interface MeDBPropsInput {
    url: string
    methodToSend: string
    token: string
    dataToSend?: string
}

export interface MeDBPropsOutput<T> {
    dataToResponse: T | null
    favorites?: JeuxProps[]
    responseType: "Error" | "Success"
    error?: string
}

/* ----------------------------------
                Games
-----------------------------------*/

export interface getGameInput {
    url: string
    setError: (value: string) => void
}

export interface getGameOutput<T> {
    dataToResponse?: T[] | null
    dataToResponseSolo?: T | null
    dataHomePage?: T | null;
}