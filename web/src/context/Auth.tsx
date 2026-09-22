import React, {useState, useEffect, createContext, useContext} from 'react'
import {useLocalStorage} from '../hooks/LocalStorage'
import {type JeuxProps} from '../interfaces/gameInt'
import { URL_API } from '../utils/Links'

interface AuthValue {
    token: string
    name: string
    favorites: JeuxProps[]
}

interface AuthContextType {
  auth: AuthValue | null
  setAuth: React.Dispatch<React.SetStateAction<AuthValue | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ({children} : {children: React.ReactNode}) {
    const [auth, setAuth] = useState<AuthValue | null>(() => {
        try {
            const savedAuth = localStorage.getItem('auth')
            return savedAuth !== null ? JSON.parse(savedAuth) : null
        } catch {
            return null
        }
    })

    // Enregistrement dans le local storage les données de l'utilisateur et dans l'api
    useEffect(() => {
        if (!auth) {
            return
        }

        // Sauvegarde dans le local storage
        localStorage.setItem('auth', JSON.stringify(auth))

        const saveFavoritesApi = async () => {
            try {
                const response = await fetch(`${URL_API}/me/updateFavorite`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    },
                    body: JSON.stringify({ name: auth.name, favorites: auth.favorites }),
                })

                if (!response.ok) {
                    alert ("Modifications non sauvegardées")
                    return
                }
            } catch {
                
            }
        }

        saveFavoritesApi()

    }, [auth])

    // Provider
    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth () {
    const ctx = useContext(AuthContext)

    if (ctx === undefined) {
        throw new Error ("Pas de provider Auth")
    }

    return ctx
}