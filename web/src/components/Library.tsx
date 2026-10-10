import { useEffect, useState } from 'react'

import GameCard from './GameCard'
import SearchFilter from '../components/SearchFilter'
import { type JeuxProps } from '../interfaces/gameInt'
import { URL_API } from '../utils/Links'
import { UseTheme } from '../hooks/Theme'
import { UseSearch } from '../hooks/Research'
import erreur404 from '../assets/404.png'
import Button from './Button';
import { GetGamesDB } from '../services/RequestsDb'
import { type AllGamesResponse } from '../types/api'


export default function Library() {
    const [games, setGames] = useState<JeuxProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    // Défilement infini
    const limit = 12
    const [page, setPage] = useState<number>(1)
    const [isEnoughtGames, setIsEnoughtGame] = useState<boolean>(true)

    // Recherche
    const { search: searchTherme, setSearch: setSearchTherme, searchOrigin, setSearchOrigin } = UseSearch()

    // Hook Theme
    const { theme } = UseTheme()

    /* ---------------------
        Récup depuis BDD
    ----------------------*/

    // Recherche de jeux dans la bdd
    const getGames = async (pageNumber: number) => {
        const response = await GetGamesDB<AllGamesResponse>({url: `${URL_API}/items?q=${searchOrigin === "bySearchBar" ? encodeURIComponent(searchTherme.trim()) : ""}&categorie=${searchOrigin === "byFilters" ? encodeURIComponent(searchTherme.trim()) : ""}&page=${pageNumber}&limit=${limit}`, setError: setError})
        
        if (!response) {
            setError("Serveur indisponible")
            setIsLoading(false)
            return
        }

        if (!response.dataHomePage) {
            setIsLoading(false)
            return
        }

        const dataResponse = response.dataHomePage?.results

        setError("")

        if (Array.isArray(dataResponse)) {
            // vérif si c'est page 1 : data sinon mettre à la suite
            setGames(c => pageNumber === 1 ? dataResponse : [...c, ...dataResponse])
            // Vérif ssi assez de jeux dans la bdd
            setIsEnoughtGame(dataResponse.length === limit ? true : false)

            // Enlever le chargement
            setIsLoading(false)
        } else {
            setGames([])
            setIsEnoughtGame(false)
            setIsLoading(false)
        }

        setPage(pageNumber)
    }

    useEffect(() => {
        getGames(1)
    }, [searchTherme, searchOrigin])

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
            <SearchFilter search={searchTherme} searchFunction={setSearchTherme} searchOrigin={searchOrigin} searchOriginFunction={setSearchOrigin}></SearchFilter>
            <h2 className={`mb-6 text-2xl font-black sm:text-3xl ${theme === "dark" ? "text-slate-900" : "text-white"}`}>Jeux actuellement sur le site</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {
                    games.length === 0 ? (<p className={`rounded-2xl border px-4 py-6 text-sm font-medium ${theme === "dark" ? "border-slate-700 bg-slate-900 text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}>Pas de jeux</p>) : null
                }
                {
                    games.map(game => {
                        return (
                            <li className="min-w-0" key={game.id}>
                                <GameCard id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} annee={game.annee} genre={game.genre} image={game.image} description={game.description} isMyLibrary={false}></GameCard>
                            </li>
                        )
                    })
                }
            </ul>

            <Button isDisable={!isEnoughtGames} handleClick={() => {getGames(page + 1)}}
                style="flex place-self-center align-self-center mt-5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-black disabled:hover:bg-slate-500"
            >Voir plus de jeux</Button>

        </section>
    )
}
