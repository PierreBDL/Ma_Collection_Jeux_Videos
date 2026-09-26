import { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';

import {useAuth} from '../context/Auth'
import {UseTheme} from '../hooks/Theme'
import GameCard from '../components/GameCard'
import { URL_API } from '../utils/Links'
import Button from '../components/Button'
import { type JeuxProps } from '../interfaces/gameInt';
import {MeDB} from '../connection/RequestsDb'

import erreur404 from '../assets/404.png'

export default function MyLibraryPage () {
    const [games, setGames] = useState<JeuxProps[]>([])

    // Hook Auth
    const { auth } = useAuth()

    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    // Navigate 
    const navigate = useNavigate()

    /* ----------------------------------------------
        Vérif syncro entre favoris back et front
    -----------------------------------------------*/
    useEffect(() => {
        if (!auth) {
            return
        }

        const checkBdd = async () => {
            const response = await MeDB({url: `${URL_API}/me/collection`, methodToSend: 'POST', token: auth.token})

            if (response.responseType === "Error") {
                return
            }
            
            if (response.favorites) {
                setGames(response.favorites)
            }
        }

        checkBdd()
    }, [auth?.token])

    if (!auth) {
        return (
            <div className="text-center w-full flex-1 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Vous n'êtes pas connecté</h1>
                <img src={erreur404} alt="Erreur" />
                <Button style="rounded-lg mt-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer" isDisable={false} handleClick={() => navigate("/login")}>Se connecter</Button>
            </div>
        )
    }

    if (auth?.favorites !== undefined && auth?.favorites.length <= 0) {
        return (
            <div className="text-center w-full flex-1 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Vous n'avez pas de jeu favoris</h1>
                <img src={erreur404} alt="Erreur" />
                <Button style="rounded-lg mt-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer" isDisable={false} handleClick={() => navigate("/")}>Revenir à l'accueil</Button>
            </div>
        )
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <h2 className={`mb-6 text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Jeux actuellement en favoris</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {
                    games.map(game => (
                        <li className="min-w-0" key={game.id}>
                            <GameCard id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} annee={game.annee} genre={game.genre}></GameCard>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}