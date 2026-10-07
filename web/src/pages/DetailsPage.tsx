import {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import {type JeuxProps} from '../interfaces/gameInt'
import { URL_API } from '../utils/Links'
import {useAuth} from '../hooks/Auth'
import {GetGamesDB} from '../hooks/RequestsDb'
import CardDetailsGame from '../components/CardDetailsGame'
import UserFormDetails from '../components/UserFormDetails'
import { type GameResponse } from '../types/api'

type stateGame = "a_decouvrir" | "en_cours" | "termine"

export default function DetailsPage () {
    const [game, setGame] = useState<JeuxProps | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    
    const [canSave, setCanSave] = useState<boolean | null>(null) // Sauvegarder dans la  bdd

    // Etat du jeu
    const [state, setState] = useState<stateGame>("a_decouvrir")

    // Navigate
    const navigate = useNavigate()

    // Get Id
    const { id } = useParams<{ id: string }>()

    /* ---------------------
        Récup depuis BDD
    ----------------------*/

    useEffect(() => {

        // Sécurité
        if (!id) {
            navigate("/")
            return
        }

        const getGame = (async () => {
            const response = await GetGamesDB<GameResponse>({url: `${URL_API}/games/${id}`, setError: setError})
            
            if (response.dataToResponseSolo !== null && response.dataToResponseSolo) {
                setGame(response.dataToResponseSolo)
                setIsLoading(false)
            }
        })

        getGame()
    }, [id])


    /* ---------------------
            Favoris
    ----------------------*/

    const {auth, setAuth} = useAuth()

    function handleFavorite () {
        // Si l'utilisateur pas connecté
        if (!auth) {
            navigate("/login")
            return
        }

        // Si la page de détail est vide
        if (!game) {
            navigate("/")
            return
        }

        // Chercher si le jeu est déjà favoris
        const searchFavoris = auth.favorites.filter(favoriteGame => favoriteGame.id === game.id)
        
        let newListFavorites: JeuxProps[]

        if (searchFavoris.length > 0) {
            newListFavorites = auth.favorites.filter(favoriteGame => favoriteGame.id !== game.id)
        } else {
            newListFavorites = [...auth.favorites, game]
        }

        setAuth({...auth, favorites: newListFavorites})
    }

    /* ---------------------
            Affichage
    ----------------------*/

    if (error !== "") {
        return (
            <p className="p-4 text-red-500">Erreur: {error}</p>
        )
    }

    if (isLoading) {
        return (
            <p className="p-4">Chargement...</p>
        )
    }

    if (!game) {
        return (
            <p className="p-4">Jeu introuvable.</p>
        )
    }

    return (
        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-6 px-4 py-8 lg:grid-cols-2 lg:gap-8 justify-center">
            <CardDetailsGame state={state} setState={setState} id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} genre={game.genre} annee={game.annee} image={game.image} description={game.description} handleFavorite={() => handleFavorite()} canSaveFunc={setCanSave}></CardDetailsGame>
            <UserFormDetails gameId={game.id} state={state} setState={setState} canSave={canSave}></UserFormDetails>
        </div>
    )
}