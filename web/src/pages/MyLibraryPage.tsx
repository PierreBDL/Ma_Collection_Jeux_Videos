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
    const [gamesFilters, setGamesFilters] = useState<JeuxProps[]>([])
    const [filtreSelect, setFiltreSelect] = useState<string>("tous")

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


    /* ------------
         Filtre
    -------------*/

    // Mettre tous les jeux
    useEffect(() => {
        setGamesFilters(games)
    }, [auth?.favorites])

    // Filtrer
    const filtrer = (filtre: string) => {
        if (filtre === "tous") {
            setGamesFilters([...games])
        } else {
            setGamesFilters(games.filter(game => game.state === filtre))
        }
        setFiltreSelect(filtre)
    }

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
            <h2 className={`justify-self-center mb-6 text-2xl font-bold ${theme === "light" ? "text-white" : "text-slate-900"}`}>Jeux actuellement en favoris</h2>
            <div className={`mb-6 flex gap-3 max-w-full justify-center justify-self-center rounded-lg border p-2 px-2.5 ${theme === "light" ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-100"}`}>
                <Button style={`rounded px-3 py-2 text-xs ${"tous" === filtreSelect? theme === "light" ? "bg-blue-500 text-white" : "bg-blue-400 text-slate-700" : theme === "light" ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"}`} isDisable={"tous" === filtreSelect ? true : false} handleClick={() => filtrer("tous")}>Tous</Button>
                {
                    ["a_decouvrir", "en_cours", "termine"].map(filtre => {
                        return (<Button style={`rounded px-3 py-2 text-xs ${filtre === filtreSelect? theme === "light" ? "bg-blue-500 text-white" : "bg-blue-400 text-slate-700" : theme === "light" ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"}`} isDisable={filtre === filtreSelect ? true : false} handleClick={() => filtrer(filtre)}>{filtre === "a_decouvrir" ? "A découvrir" : (filtre === "en_cours" ? "En cours" : (filtre === "termine" ? "terminé" : null))}</Button>)
                    })
                }
            </div>
            <ul className="grid grid-cols-1 gap-15 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                {
                    gamesFilters.map(game => (
                        <li className="min-w-0" key={game.id}>
                            <GameCard id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} annee={game.annee} genre={game.genre} image={game.image} description={game.description} opinion={game.opinion} grade={game.grade} state={game.state} isMyLibrary={true}></GameCard>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}