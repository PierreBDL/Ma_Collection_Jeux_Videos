import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

import { URL_API } from '../utils/Links'
import { useAuth } from '../context/Auth'
import {MeDB} from '../connection/RequestsDb'
import Button from '../components/Button'
import {UseTheme} from '../hooks/Theme'

interface PrintCommentsProps {
    id: number
    nom: string
    opinion: string
    grade: number
    state: "a_decouvrir" | "en_cours" | "termine"
}

export default function PrintComments ({setMoyenne}: {setMoyenne: (value: number) => void}) {

    const [games, setGames] = useState<PrintCommentsProps[]>([])

    // Hook auth
    const { auth } = useAuth()

    // Theme
    const {theme} = UseTheme()

    /* ---------------------
        Récup depuis BDD
    ----------------------*/

    useEffect(() => {
        // Si pas connecté
        if (!auth) {
            setGames([])
            return
        }

        const getGames = (async () => {
            const response = await MeDB<PrintCommentsProps[]>({url: `${URL_API}/me/getAllGrade`, token: auth.token, methodToSend: "GET"})
            
            if (response.dataToResponse !== null && response.dataToResponse && response.responseType === "Success") {
                setGames(response.dataToResponse)
            }
        })

        getGames()
    }, [auth?.token])

    // Redirection
    const navigate = useNavigate()

    function voirPlus (id: number) {
        navigate(`/details/${id}`)
    }

    // Calcul moyenne 
    let total = 0
    
    const gamesWithGrade = games.filter(game => game.grade !== null)
    gamesWithGrade.map(game => total = total + game.grade)
    setMoyenne(total / gamesWithGrade.length)

    return (
        <div className="grid min-w-0 max-h-[75vh] grid-cols-1 gap-4 overflow-y-auto">
            {games.map(game => (
                <article key={game.id} className={`flex min-w-0 flex-col gap-3 rounded-lg border ${theme === "dark" ? "border-slate-600 bg-slate-800 text-white" : "border-slate-600 bg-slate-300 text-black"} p-4 shadow-sm sm:p-5`}>
                    <h3 className="min-w-0 text-sm">{game.nom}</h3>
                    <p className="font-semibold">Note : {game.grade ? (game.grade + "/5") : ("∅")}</p>
                    <p className="min-w-0 text-sm">Mémo: {game.opinion ? (game.opinion) : ("∅")}</p>
                    <Button isDisable={false} handleClick={() => voirPlus(game.id)} style="rounded-lg mt-2 p-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer">Aller sur la page</Button>
                </article>
            ))}
        </div>
    )
}