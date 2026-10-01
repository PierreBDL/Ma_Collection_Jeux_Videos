import { useEffect, useState } from 'react'

import GameCard from './GameCard'
import SearchBar from '../components/SearchBar'
import SearchFilter from '../components/SearchFilter'
import { type JeuxProps } from '../interfaces/gameInt'
import { type searchType } from '../types/SearchType'
import { URL_API } from '../utils/Links'
import { UseTheme } from '../hooks/Theme'
import erreur404 from '../assets/404.png'
import Button from './Button';
import { GetGamesDB } from '../connection/RequestsDb'


export default function Library() {
    const [games, setGames] = useState<JeuxProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    // Défilement infini
    const limit = 12
    const [skip, setSkip] = useState<number>(0)
    const [isEnoughtGames, setIsEnoughtGame] = useState<boolean>(true)

    // Recherche
    const [searchTherme, setSearchTherme] = useState<string>('')
    const [searchOrigin, setSearchOrigin] = useState<searchType>("bySearchBar")
    const [searchResult, setSearchResult] = useState<JeuxProps[]>([])
    const [limitSearch, setLimitSearch] = useState<number>(12)

    // Hook Theme
    const { theme } = UseTheme()

    /* ---------------------
        Récup depuis BDD
    ----------------------*/

    const getGames = async (skipNumber: number) => {
        let response = await GetGamesDB({ url: `${URL_API}/games?limit=${limit}&skip=${skipNumber}`, setError: setError })
        const data = response.dataToResponse

        if (data !== null && data) {

            // Eviter les doubles requêtes
            if (skipNumber === 0) {
                setGames([...data])
            } else {
                setGames(g => [...g, ...data])
            }

            // Vérif si assez de jeu dans la bdd
            if (data.length < limit) {
                setIsEnoughtGame(false)
            }

            setSkip(skipNumber)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        getGames(0)
    }, [])


    /* ---------------------
            Recherche
    ----------------------*/

    // Recherche du jeu dans la bdd
    const searchBDD = async (skipNumber: number) => {
        const response = await GetGamesDB({
            url: `${URL_API}/games/search?therme=${encodeURIComponent(searchTherme.trim())}&origin=${searchOrigin}&limit=${limit}&skip=${skipNumber}`,
            setError: setError
        })
        const data = response.dataToResponse

        if (Array.isArray(data)) {
            setSearchResult(c => skipNumber === 0 ? data : [...c, ...data])
            setIsEnoughtGame(data.length === limit)
        } else {
            setSearchResult([])
            setIsEnoughtGame(false)
        }
    }

    useEffect(() => {
        if (searchTherme.trim() === "") {
            setSearchResult(games)
            return
        }
        searchBDD(0)
    }, [searchTherme, searchOrigin, games])

    useEffect(() => {
        setLimitSearch(12)
        setIsEnoughtGame(true)
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

    const gamesToDisplay = searchTherme.trim() === "" ? games : searchResult
    const gameVisible = gamesToDisplay.slice(0, limitSearch)

    return (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <SearchBar search={searchTherme} searchFunction={setSearchTherme} searchOrigin={searchOrigin} searchOriginFunction={setSearchOrigin}></SearchBar>
            <SearchFilter search={searchTherme} searchFunction={setSearchTherme} searchOrigin={searchOrigin} searchOriginFunction={setSearchOrigin}></SearchFilter>
            <h2 className={`mb-6 text-2xl font-black sm:text-3xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Jeux actuellement sur le site</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {
                    gameVisible.length === 0 ? (<p className={`rounded-2xl border px-4 py-6 text-sm font-medium ${theme === "dark" ? "border-slate-700 bg-slate-900 text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}>Pas de jeux</p>) : null
                }
                {
                    gameVisible.map(game => {
                        return (
                            <li className="min-w-0" key={game.id}>
                                <GameCard id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} annee={game.annee} genre={game.genre} image={game.image} description={game.description} isMyLibrary={false}></GameCard>
                            </li>
                        )
                    })
                }
            </ul>

            <Button isDisable={!isEnoughtGames} handleClick={() => {
                if (searchTherme.trim() === "") {
                    if (games.length <= limitSearch) {
                        getGames(skip + limit)
                    }
                } else {
                    searchBDD(limitSearch)
                }
                setLimitSearch(current => current + limit)
            }}
                style="flex place-self-center align-self-center mt-5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-black disabled:hover:bg-slate-500"
            >Voir plus de jeux</Button>

        </section>
    )
}