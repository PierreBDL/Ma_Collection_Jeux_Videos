import React, {useState, useEffect, createContext, useContext} from 'react'

interface AuthValue {
    token: string
    name: string
}

interface AuthContextType {
  auth: AuthValue | null
  setAuth: React.Dispatch<React.SetStateAction<AuthValue | null>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ({children} : {children: React.ReactNode}) {
    const [auth, setAuth] = useState<AuthValue | null>(null)

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