import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/Auth'
import { UseTheme } from '../hooks/Theme'
import GameCard from '../components/GameCard'
import { URL_API } from '../utils/Links'
import Button from '../components/Button'
import { type JeuxProps } from '../interfaces/gameInt';
import { MeDB } from '../hooks/RequestsDb'
import { type FavoritesResponse } from '../types/api'

import erreur404 from '../assets/404.png'

type statePossibleType = "tous" | "a_decouvrir" | "en_cours" | "termine"
type sortPossibleType = "tous" | "date" | "note"

export default function MyLibraryPage() {
    const [games, setGames] = useState<JeuxProps[]>([])
    const [stateSelect, setStateSelect] = useState<statePossibleType>("tous")
    const [sortSelect, setSortSelect] = useState<sortPossibleType>("tous")

    // Hook Auth
    const { auth, setAuth } = useAuth()

    // Hook Theme
    const { theme } = UseTheme()

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
            const response = await MeDB<FavoritesResponse>({ url: `${URL_API}/me/collection?statut=${stateSelect}&tri=${sortSelect}`, methodToSend: 'GET', token: auth.token })

            if (response.responseType === "Error") {
                return
            }

            if (response.favorites) {
                setGames(response.favorites)
                setAuth({ ...auth, favorites: response.favorites })
            }
        }

        checkBdd()
    }, [auth?.token, stateSelect, sortSelect])


    /* ------------
         Filtres
    -------------*/

    // Filtrer
    const filtrer = ({ state, sort }: { state: statePossibleType, sort: sortPossibleType }) => {
        setSortSelect(sort ?? sortSelect)
        setStateSelect(state ?? stateSelect)
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
                <h1 className={`text-3xl font-bold ${theme === "light" ? "text-white" : "text-slate-900"}`}>Vous n'avez pas de jeu favoris</h1>
                <img src={erreur404} alt="Erreur" />
                <Button style="rounded-lg mt-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer" isDisable={false} handleClick={() => navigate("/")}>Revenir à l'accueil</Button>
            </div>
        )
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <h2 className={`justify-self-center mb-6 text-2xl font-bold ${theme === "light" ? "text-white" : "text-slate-900"}`}>Jeux actuellement en favoris</h2>
            <div className={`mb-6 flex w-full max-w-full flex-col gap-3 justify-center justify-self-center xl:w-auto xl:flex-row rounded-md border p-2 px-2.5 ${theme === "light" ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-100"}`}>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button style={`rounded px-3 py-2 ${stateSelect === "tous" ? "bg-blue-600 text-white hover:bg-blue-700" : theme === "light" ? "bg-slate-800 text-slate-300 hover:bg-slate-900" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`} isDisable={stateSelect === "tous" ? true : false} handleClick={() => filtrer({ state: "tous", sort: sortSelect })}>Tous</Button>
                    <Button style={`rounded px-3 py-2 ${stateSelect === "a_decouvrir" ? "bg-blue-600 text-white hover:bg-blue-700" : theme === "light" ? "bg-slate-800 text-slate-300 hover:bg-slate-900" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`} isDisable={stateSelect === "a_decouvrir" ? true : false} handleClick={() => filtrer({ state: "a_decouvrir", sort: sortSelect })}>A Découvrir</Button>
                    <Button style={`rounded px-3 py-2 ${stateSelect === "en_cours" ? "bg-blue-600 text-white hover:bg-blue-700" : theme === "light" ? "bg-slate-800 text-slate-300 hover:bg-slate-900" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`} isDisable={stateSelect === "en_cours" ? true : false} handleClick={() => filtrer({ state: "en_cours", sort: sortSelect })}>En Cours</Button>
                    <Button style={`rounded px-3 py-2 ${stateSelect === "termine" ? "bg-blue-600 text-white hover:bg-blue-700" : theme === "light" ? "bg-slate-800 text-slate-300 hover:bg-slate-900" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`} isDisable={stateSelect === "termine" ? true : false} handleClick={() => filtrer({ state: "termine", sort: sortSelect })}>Terminé</Button>
                </div>

                <div className={`hidden xl:block min-h-5 max-h-7 w-1 ${theme === "dark" ? "bg-black" : "bg-white"} flex place-self-center`}></div>

                <div className="flex flex-wrap justify-center gap-2">
                    <Button style={`rounded px-3 py-2 ${sortSelect === "tous" ? "bg-blue-600 text-white hover:bg-blue-700" : theme === "light" ? "bg-slate-800 text-slate-300 hover:bg-slate-900" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`} isDisable={sortSelect === "tous" ? true : false} handleClick={() => filtrer({ state: stateSelect, sort: "tous" })}>Tous</Button>
                    <Button style={`rounded px-3 py-2 ${sortSelect === "date" ? "bg-blue-600 text-white hover:bg-blue-700" : theme === "light" ? "bg-slate-800 text-slate-300 hover:bg-slate-900" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`} isDisable={sortSelect === "date" ? true : false} handleClick={() => filtrer({ state: stateSelect, sort: "date" })}>Date</Button>
                    <Button style={`rounded px-3 py-2 ${sortSelect === "note" ? "bg-blue-600 text-white hover:bg-blue-700" : theme === "light" ? "bg-slate-800 text-slate-300 hover:bg-slate-900" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`} isDisable={sortSelect === "note" ? true : false} handleClick={() => filtrer({ state: stateSelect, sort: "note" })}>Note</Button>
                </div>
            </div>
            <ul className="grid grid-cols-1 gap-15 sm:grid-cols-2 lg:grid-cols-3 mb-4">
                {
                    games.map(game => (
                        <li className="min-w-0" key={game.id}>
                            <GameCard id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} annee={game.annee} genre={game.genre} image={game.image} description={game.description} opinion={game.opinion} grade={game.grade} state={game.etat ?? game.state} isMyLibrary={true}></GameCard>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}
