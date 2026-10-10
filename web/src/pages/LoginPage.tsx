import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import Form from '../components/Form'
import { URL_API } from '../utils/Links'
import {useLocalStorage} from '../hooks/LocalStorage'
import {useAuth} from '../context/AuthContext'
import {AuthDB, MeDB} from '../services/RequestsDb'
import {type LoginResponse, type MeResponse, type FavoritesResponse} from '../types/api'

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
            const { access_token } = response.dataToResponse

            // Get user
            const user = await MeDB<MeResponse>({url: `${URL_API}/auth/me`, methodToSend: "GET", token: access_token})
            if (!user.dataToResponse) {
                setError(user.error ?? "Utilisateur introuvable")
                return
            }

            // Get favoris
            const collection = await MeDB<FavoritesResponse>({url: `${URL_API}/me/collection`, methodToSend: "GET", token: access_token})
            if (!collection.favorites) {
                setError(collection.error ?? "Favoris indisponibles")
                return
            }

            // Stockage du token et du username
            setToken(access_token)
            setAuth({token: access_token, refreshToken: "", name: user.dataToResponse.name, favorites: collection.favorites})

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