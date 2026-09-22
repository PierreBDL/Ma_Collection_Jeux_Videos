import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';

import {type JeuxProps} from '../interfaces/gameInt'
import { URL_API } from '../utils/Links'
import {UseTheme} from '../hooks/Theme'
import {useAuth} from '../context/Auth'
import Button from '../components/Button'

import notFavoriteImg from '../assets/etoile_vide.png'
import favoriteImg from '../assets/etoile.png'

export default function DetailsPage () {
    const [game, setGame] = useState<JeuxProps | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    // Get Id
    const { id } = useParams<{ id: string }>()

    /* ---------------------
        Récup depuis BDD
    ----------------------*/

    useEffect(() => {

        // Sécurité
        if (!id) {
            return
        }

        const getGame = (async () => {
            try {
                const response = await fetch(`${URL_API}/game/${id}`)

                if (!response.ok) {
                    setError("Le serveur a renvoyé une erreur")
                    throw new Error ("Le serveur a renvoyé une erreur")
                }

                const data: JeuxProps = await response.json()

                setGame(data)
            } catch {
                setError("Serveur indisponible")
            } finally {
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
            return
        }

        // Si la page de détail est vide
        if (!game) {
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
        <div className="w-full flex-1 flex justify-center items-center">
            <div className="relative pt-8 max-w-3xl mb-30">
                <div className={`absolute h-8 top-0 right-0 px-4 py-1 text-center mx-auto border ${theme === "light" ? "border-slate-600 bg-slate-300" : "border-white bg-slate-600"} rounded-t-2xl`}>
                    Disponible
                </div>
                <div className={`relative p-9 pb-10 max-w-4xlmx-auto border ${theme === "light" ? "border-slate-600 bg-slate-300" : "border-white bg-slate-600"} rounded-b-2xl rounded-tl-2xl`}>
                    <div className="flex flex-raw justify-between mb-3">
                        <div className="flex flex-col">
                            <h1 className="text-3xl font-bold mb-4">{game.nom}</h1>
                            <p className="mb-2"><strong>Studio :</strong> {game.studio}</p>
                            <p className="mb-2"><strong>Plateforme :</strong> {game.plateforme}</p>
                            <p className="mb-2"><strong>Catégorie :</strong> {game.genre}</p>
                            <p className="mb-2"><strong>Année :</strong> {game.annee}</p>
                        </div>
                        <div>
                            <img src={`/images/${game.image}`} className="w-80 h-auto max-h-40 rounded-lg mb-4 mr-4"></img>
                        </div>
                    </div>
                    <p className="mt-4"><strong>Description :</strong> {game.description}</p>

                    <Button style="absolute bg-gray-400 bottom-5 right-5 w-9 h-9 rounded-2xl mt-2 hover:bg-slate-300 font-medium text-sm transition-colors cursor-pointer" 
                            handleClick={() => handleFavorite()} isDisable={false}>
                        {
                            // Gestion logo
                            (auth != null && auth.favorites.filter(favoriteGame => favoriteGame.id === game.id).length > 0) ? (
                                <img className="w-6 h-6 flex place-self-center justify-self-center" src={favoriteImg} alt="Retirer des favoris" />
                            ) : (
                                <img className="w-6 h-6 flex place-self-center justify-self-center" src={notFavoriteImg} alt="Ajouter aux favoris" />
                            )
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}