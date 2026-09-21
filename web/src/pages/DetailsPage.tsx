import {useEffect, useState} from 'react'

import {type JeuxProps} from '../interfaces/gameInt'
import { URL_API } from '../utils/Links'
import {UseTheme} from '../hooks/Theme'
import { useParams } from 'react-router-dom';

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
            <div className={`p-9 max-w-4xl m-5 mx-auto border ${theme === "light" ? "border-slate-600 bg-slate-300" : "border-white bg-slate-600"} rounded-2xl`}>
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
            </div>
        </div>
    )
}