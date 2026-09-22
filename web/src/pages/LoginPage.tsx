import {useEffect, useState} from 'react'
import Form from '../components/Form'
import { URL_API } from '../utils/Links'
import {useLocalStorage} from '../hooks/LocalStorage'
import {useAuth} from '../context/Auth'

export default function LoginPage() {

    /* ------------------------
        States Identifiants
    -------------------------*/
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")

    const fonctions = {setEmail, setPassword}
    const values = {email, password}

    /* --------------------------
                Token
    ---------------------------*/

    const [token, setToken] = useLocalStorage<string | null>("token", null)
    const {auth, setAuth} = useAuth()

    /* ----------------------------
        Approuver le formulaire
    -----------------------------*/

    async function loginCheck () {
        if (email.trim() === "") {
            setError("Courriel obligatoire")
            return
        }
        if (!email.includes("@")) {
            setError("L'email doit contenir un @")
            return
        }

        /* ----------------------------
                Demander à l'API
        -----------------------------*/
        try {
            const response = await fetch(`${URL_API}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.detail)
                return
            }

            // Stockage du token
            setToken(data)
            setAuth({token: data, name: email})

            alert("Connecté")
        } catch {
            setError("Serveur indisponible")
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center w-full">
            <Form title="Se connecter" setters={fonctions} getters={values} action={loginCheck} error={error}></Form>
        </div>
    )
}