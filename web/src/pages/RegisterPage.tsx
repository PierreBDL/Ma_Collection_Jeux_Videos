import {useState} from 'react'

import Form from '../components/Form'
import { URL_API } from '../utils/Links'

import {useLocalStorage} from '../hooks/LocalStorage'
import {useAuth} from '../context/Auth'

export default function RegisterPage() {
    /* ------------------------
        States Identifiants
    -------------------------*/

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [error, setError] = useState<string>("")

    const fonctions = {setEmail, setPassword}
    const values = {email, password}

    
    /* --------------------------
                Token
    ---------------------------*/

    const [token, setToken] = useLocalStorage<string | null>("token", null)
    const {auth, setAuth} = useAuth()

    async function submitCheck () {
        if (name.trim() === "" || name.length < 3) {
            setError("Le nom est obligatoire et doit contenir 3 charactères")
            return
        }

        if (!email.includes("@")) {
            setError("L'email doit contenir un @")
            return
        }

        if (!email.includes(".")) {
            setError("L'email est invalide")
            return
        }

        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères")
            return
        }

        /* ----------------------------
                Demander à l'API
        -----------------------------*/
        try {
            const response = await fetch(`${URL_API}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.detail)
                return
            }

            // Stockage du token
            setToken(data.token)
            setAuth({token: data.token, name: data.name})

            alert("Inscrit")
        } catch {
            setError("Serveur indisponible")
        }
    }

    return (
        <div className="w-full flex-1 flex justify-center items-center">
            <Form title="S'inscrire" setters={fonctions} getters={values} action={submitCheck} error={error} isRegisterPage={true} name={{valueName: name, setValueName: setName}}></Form>
        </div>
    )
}