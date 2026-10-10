import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Form from '../components/Form'
import { URL_API } from '../utils/Links'
import { AuthDB } from '../services/RequestsDb'
import { useLocalStorage } from '../hooks/LocalStorage'
import { useAuth } from '../context/AuthContext'

import { type RegisterResponse, type LoginResponse } from '../types/api'

export default function RegisterPage() {
    /* ----------------------------------
        States Identifiants & hooks
    -----------------------------------*/

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [error, setError] = useState<string>("")

    const fonctions = { setEmail, setPassword }
    const values = { email, password }

    // Navigate
    const navigate = useNavigate()


    /* --------------------------
                Token
    ---------------------------*/

    const [token, setToken] = useLocalStorage<string | null>("token", null)
    const { auth, setAuth } = useAuth()

    async function submitCheck() {
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

        const response = await AuthDB<RegisterResponse>({ url: `${URL_API}/auth/register`, setError: setError, dataToSend: JSON.stringify({ name, email, password }) })

        if (response.dataToResponse) {
            // Login après création
            const response = await AuthDB<LoginResponse>({url: `${URL_API}/auth/login`, setError: setError, dataToSend: JSON.stringify({email, password})})
            
            // Si pas de réponse
            if (response.dataToResponse === null) {
                return
            }
            const { access_token } = response.dataToResponse

            // Stockage du token et du username
            setToken(access_token)
            setAuth({ token: access_token, refreshToken: "", name: name, favorites: [] })

            // Redirection
            navigate("/")
        }
    }

    return (
        <div className="w-full flex-1 flex justify-center items-center">
            <Form title="S'inscrire" setters={fonctions} getters={values} action={submitCheck} error={error} isRegisterPage={true} name={{ valueName: name, setValueName: setName }}></Form>
        </div>
    )
}