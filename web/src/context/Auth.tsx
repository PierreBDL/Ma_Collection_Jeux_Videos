import React, { useState, useEffect, createContext, useContext } from 'react'
import { type JeuxProps } from '../interfaces/gameInt'
import { URL_API } from '../utils/Links'
import { useNavigate } from 'react-router-dom';

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
                let response = await fetch(`${URL_API}/me/updateFavorite`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    },
                    body: JSON.stringify({ name: auth.name, favorites: auth.favorites }),
                })

                if (!response.ok && auth.refreshToken) {

                    // Refresh token
                    const newTokenResponse = await fetch(`${URL_API}/auth/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'refresh-token': auth.refreshToken
                        },
                    })

                    if (!newTokenResponse.ok) {
                        localStorage.removeItem("auth")
                        localStorage.removeItem("token")
                        setAuth(null)
                        navigate("/login")
                        return
                    }

                    // Sauvegarder nouveau token
                    const dataNewToken = await newTokenResponse.json()
                    setAuth({ ...auth, token: dataNewToken.access_token })

                    const newToken = dataNewToken.access_token

                    // Réessayer
                    response = await fetch(`${URL_API}/me/updateFavorite`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`
                        },
                        body: JSON.stringify({ name: auth.name, favorites: auth.favorites }),
                    })
                }

                if (!response.ok) {
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