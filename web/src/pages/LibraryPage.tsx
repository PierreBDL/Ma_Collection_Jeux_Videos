import {useEffect, useState} from 'react'
import GameCard from '../components/GameCard'

interface JeuxProps {
    id: number
    nom: string
    studio: string
    plateforme: string
    annee: string
    genre: string
}

export default function LibraryPage () {
    const [games, setGames] = useState<JeuxProps[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

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
        <div>
            <ul>
                <h2>Jeux</h2>
                {
                    games?.length === 0 ? (<p>Pas de jeux</p>) : null
                }
                {
                    games?.map(game => (
                        <li key={game.id}>
                            <GameCard id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} annee={game.annee} genre={game.genre}></GameCard>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}