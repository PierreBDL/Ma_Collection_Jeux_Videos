import React, { useState, useEffect, createContext, useContext } from 'react'
import { type JeuxProps } from '../interfaces/gameInt'
import { URL_API } from '../utils/Links'
import { useNavigate } from 'react-router-dom';
import {MeDB, RefrechTokenDB} from '../hooks/RequestsDb'

interface AuthValue {
    token: string
    refreshToken: string
    name: string
    favorites: JeuxProps[]
}

interface AuthContextType {
    auth: AuthValue | null
    setAuth: React.Dispatch<React.SetStateAction<AuthValue | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthValue | null>(() => {
        try {
            const savedAuth = localStorage.getItem('auth')
            return savedAuth !== null ? JSON.parse(savedAuth) : null
        } catch {
            return null
        }
    })

    // Hook navigate
    const navigate = useNavigate()

    // Enregistrement dans le local storage les données de l'utilisateur et dans l'api
    useEffect(() => {
        if (!auth) {
            return
        }

        // Sauvegarde dans le local storage
        localStorage.setItem('auth', JSON.stringify(auth))

        const saveFavoritesApi = async () => {
            try {
                let response = await MeDB({url: `${URL_API}/me/updateFavorite`, methodToSend: 'PATCH',token: auth.token, dataToSend: JSON.stringify({ name: auth.name, favorites: auth.favorites })})

                if (response.responseType === "Error" && auth.refreshToken) {

                    // Refresh token
                    const newTokenResponse = await RefrechTokenDB({url: `${URL_API}/auth/refresh`, token: auth.refreshToken})

                    if (newTokenResponse.responseType === "Error") {
                        localStorage.removeItem("auth")
                        localStorage.removeItem("token")
                        setAuth(null)
                        navigate("/login")
                        return
                    } else {
                        // Sauvegarder nouveau token
                        setAuth({ ...auth, token: newTokenResponse.response})

                        const newToken = newTokenResponse.response

                        // Réessayer
                        response = await MeDB({url: `${URL_API}/me/updateFavorite`, methodToSend: 'PATCH', token: newToken, dataToSend: JSON.stringify({ name: auth.name, favorites: auth.favorites })})
                    }
                }

                if (response.responseType === "Error") {
                    alert("Modifications non sauvegardées")
                }
            } catch {

            }
        }

        saveFavoritesApi()

    }, [auth?.favorites])

    // Provider
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)

    if (ctx === undefined) {
        throw new Error("Pas de provider Auth")
    }

    return ctx
}