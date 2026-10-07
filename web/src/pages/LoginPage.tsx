import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import Form from '../components/Form'
import { URL_API } from '../utils/Links'
import {useLocalStorage} from '../hooks/LocalStorage'
import {useAuth} from '../hooks/Auth'
import {AuthDB} from '../hooks/RequestsDb'
import {type JeuxProps} from '../interfaces/gameInt'
import {type LoginResponse} from '../types/api'

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
                Hooks
    ---------------------------*/

    const [token, setToken] = useLocalStorage<string | null>("token", null)
    const {auth, setAuth} = useAuth()


    // Navigate
    const navigate = useNavigate()

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
        const response = await AuthDB<LoginResponse>({url: `${URL_API}/auth/login`, setError: setError , dataToSend: JSON.stringify({ email, password })})

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
        <div className="flex-1 flex items-center justify-center w-full">
            <Form title="Se connecter" setters={fonctions} getters={values} action={loginCheck} error={error} isRegisterPage={false}></Form>
        </div>
    )
}