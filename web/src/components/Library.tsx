import {useEffect, useState} from 'react'

import GameCard from './GameCard'
import SearchBar from '../components/SearchBar'
import SearchFilter from '../components/SearchFilter'

import {type JeuxProps} from '../interfaces/gameInt'
import {type searchType} from '../interfaces/SearchType'




export default function Library () {
    const [games, setGames] = useState<JeuxProps[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [searchTherme, setSearchTherme] = useState<string>('')
    const [searchOrigin, setSearchOrigin] = useState<searchType>("bySearchBar")


    /* ---------------------
        Récup depuis BDD
    ----------------------*/

    useEffect(() => {
        const getGames = (async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/jeux')

                if (!response.ok) {
                    setError("Le serveur a renvoyé une erreur")
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
            <p>Erreur: {error}</p>
        )
    }

    if (isLoading) {
        return (
            <p>Chargement...</p>
        )
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <SearchBar search={searchTherme} searchFunction={setSearchTherme} searchOrigin={searchOrigin} searchOriginFunction={setSearchOrigin}></SearchBar>
            <SearchFilter search={searchTherme} searchFunction={setSearchTherme} searchOrigin={searchOrigin} searchOriginFunction={setSearchOrigin}></SearchFilter>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Jeux actuellement sur le site</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {
                    searchTab.length === 0 ? (<p>Pas de jeux</p>) : null
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