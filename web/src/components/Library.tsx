import {useEffect, useState} from 'react'

import GameCard from './GameCard'
import SearchBar from '../components/SearchBar'
import SearchFilter from '../components/SearchFilter'

import {type JeuxProps} from '../interfaces/gameInt'
import {type searchType} from '../types/SearchType'
import { URL_API } from '../utils/Links'

import {UseTheme} from '../hooks/Theme'

import erreur404 from '../assets/404.png'


export default function Library () {
    const [games, setGames] = useState<JeuxProps[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [searchTherme, setSearchTherme] = useState<string>('')
    const [searchOrigin, setSearchOrigin] = useState<searchType>("bySearchBar")


    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    /* ---------------------
        Récup depuis BDD
    ----------------------*/

    useEffect(() => {
        const getGames = (async () => {
            try {
                const response = await fetch(`${URL_API}/games`)

                if (!response.ok) {
                    setError("Le serveur a renvoyé une erreur")
                    throw new Error ("Le serveur a renvoyé une erreur")
                }

                const data: JeuxProps[] = await response.json()

                setGames(data)
            } catch {
                setError("Serveur indisponible")
            } finally {
                setIsLoading(false)
            }
        })

        getGames()
    }, [])


    /* ---------------------
            Recherche
    ----------------------*/

    const searchTab = games?.filter(game => { 
        if (searchOrigin === "bySearchBar") {   
            return game.nom.toLowerCase().includes(searchTherme.trim().toLowerCase())
        }

        if (searchOrigin === "byFilters") {
            return (game.genre.toLowerCase().includes(searchTherme.toLowerCase()) || game.plateforme.toLowerCase().includes(searchTherme.trim().toLowerCase()))
        }

        return true
    }) ?? []


    /* ---------------------
            Affichage
    ----------------------*/

    if (error !== "") {
        return (
            <div className="text-center w-full flex-1 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Oups !</h1>
                <p className="p-4 text-red-500">Erreur: {error}</p>
                <img src={erreur404} alt="Erreur 404" />
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="text-center w-full flex-1 flex flex-col justify-center items-center">
                <p className="p-4">Chargement...</p>
            </div>
        )
    }

    if (games != undefined && games?.length <= 0) {
        return (
            <div className="text-center w-full flex-1 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Oups !</h1>
                <h3 className="p-4">Aucun jeu</h3>
                <img src={erreur404} alt="Erreur" />
            </div>
        )
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <SearchBar search={searchTherme} searchFunction={setSearchTherme} searchOrigin={searchOrigin} searchOriginFunction={setSearchOrigin}></SearchBar>
            <SearchFilter search={searchTherme} searchFunction={setSearchTherme} searchOrigin={searchOrigin} searchOriginFunction={setSearchOrigin}></SearchFilter>
            <h2 className={`mb-6 text-2xl font-black sm:text-3xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Jeux actuellement sur le site</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {
                    searchTab.length === 0 ? (<p className={`rounded-2xl border px-4 py-6 text-sm font-medium ${theme === "dark" ? "border-slate-700 bg-slate-900 text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}>Pas de jeux</p>) : null
                }
                {
                    searchTab.map(game => (
                        <li className="min-w-0" key={game.id}>
                            <GameCard id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} annee={game.annee} genre={game.genre}></GameCard>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}