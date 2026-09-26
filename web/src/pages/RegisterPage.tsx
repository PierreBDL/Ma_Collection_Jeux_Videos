import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

import Form from '../components/Form'
import { URL_API } from '../utils/Links'
import {AuthDB} from '../connection/RequestsDb'
import {type JeuxProps} from '../interfaces/gameInt'

import {useLocalStorage} from '../hooks/LocalStorage'
import {useAuth} from '../context/Auth'

interface AuthResponse {
    access_token: string
    refresh_token: string
    name: string
    favorites: JeuxProps[]
}

export default function RegisterPage() {
    /* ----------------------------------
        States Identifiants & hooks
    -----------------------------------*/

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [error, setError] = useState<string>("")

    const fonctions = {setEmail, setPassword}
    const values = {email, password}

    // Navigate
    const navigate = useNavigate()

    
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

        const response = await AuthDB<AuthResponse>({url: `${URL_API}/auth/register`, setError: setError , dataToSend: JSON.stringify({ name, email, password })})

        if (response.dataToResponse) {
            const { access_token, refresh_token, name, favorites } = response.dataToResponse

            // Stockage du token et du username
            setToken(access_token)
            setAuth({token: access_token, refreshToken: refresh_token, name: name, favorites: favorites})

            // Redirection
            navigate("/")
        }
    }

    return (
        <div className="w-full flex-1 flex justify-center items-center">
            <Form title="S'inscrire" setters={fonctions} getters={values} action={submitCheck} error={error} isRegisterPage={true} name={{valueName: name, setValueName: setName}}></Form>
        </div>
    )
}