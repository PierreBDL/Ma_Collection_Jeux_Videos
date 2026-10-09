import React, { useState, useEffect, createContext, useContext } from 'react'
import { type JeuxProps } from '../interfaces/gameInt'

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

    // Enregistrement local des données de l'utilisateur
    useEffect(() => {
        if (!auth) {
            localStorage.removeItem('auth')
            return
        }

        localStorage.setItem('auth', JSON.stringify(auth))
    }, [auth])

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