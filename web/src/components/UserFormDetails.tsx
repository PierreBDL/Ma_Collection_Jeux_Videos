import { useEffect, useState } from 'react';

import Button from './Button'
import {UseTheme} from '../hooks/Theme'
import {MeDB} from '../connection/RequestsDb'
import { URL_API } from '../utils/Links'
import {useAuth} from '../context/Auth'

import notFavoriteImg from '../assets/etoile_vide.png'
import favoriteImg from '../assets/etoile.png'

interface GradeResponse {
    grade: number
    opinion: string
}

export default function UserFormDetails ({gameId}: {gameId: number}) {
    const [grade, setGrade] = useState<number>(0)
    const [opinion, setOpinion] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
    
    // Hook Theme
    const { theme } = UseTheme()

    // hook Auth
    const {auth} = useAuth()

    // Sauvegarde du formulaire
    async function handleSaveForm () {
        // Vérif entrées
        if (grade <= 0 || grade > 5) {
            setError("La note doit être comprise entre 1 et 5")
            return
        }

        // Si pas d'utilisateur
        if (!auth) {
            return
        }

        const response = await MeDB<boolean>({url: `${URL_API}/me/saveGrade`, methodToSend: 'PUT', token: auth.token, dataToSend: JSON.stringify({ game_id: gameId, name: auth.name, opinion: opinion, grade: grade })})
    
        if (response.responseType === "Success") {
            setIsSuccess(true)
        } else {
            setIsSuccess(false)
            setError("Erreur lors de l'enregistrement")
        }
    }

    // Récup infos bdd
    useEffect(() => {
        // Vérif connecté
        if (!auth) {
            return
        }

        const getBdd = async () => {
            const response = await MeDB<GradeResponse>({url: `${URL_API}/me/getGrade?game_id=${gameId}`, methodToSend: 'GET', token: auth.token})

            if (response.responseType === "Success" && response.dataToResponse) {
                setGrade(response.dataToResponse.grade)
                setOpinion(response.dataToResponse.opinion)
                setError("")
            } else {
                setIsSuccess(false)
                setError("Erreur lors de la récupération depuis le serveur")
            }
        }

        getBdd()
    }, [auth?.token, gameId])


    return (
        <div className={`w-full mt-4 relative pt-8 max-w-3xl lg:mb-30 flex flex-col p-6 rounded-lg border ${theme === "light" ? "border-black bg-white text-gray-800" : "border-white bg-slate-600 text-white" }`}>
            <h1 className="text-xl font-semibold text-center mb-2">Votre mémo sur le jeu</h1>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col font-medium gap-3">

                <label>Note :</label>
                <div className="flex flex-row gap-3">
                    <Button isDisable={grade <= 0 ? true : false} style="w-7 h-7 bg-blue-600 rounded-full border border-blue-600 hover:bg-blue-700 hover:border-white disabled:bg-gray-400 disabled:border-gray-400 disabled:hover:cursor-not-allowed" handleClick={() => setGrade(s => s - 1)}>-</Button>
                    <div className="flex flex-row gap-3">
                        {[1, 2, 3, 4, 5].map(star => (
                            <img key={star} src={star <= grade ? favoriteImg : notFavoriteImg } alt={`${star}`} className="w-7 h-7" />
                        ))}
                    </div>
                    <Button isDisable={grade >= 5 ? true : false} style="w-7 h-7 bg-blue-600 rounded-full border border-blue-600 hover:bg-blue-700 hover:border-white disabled:bg-gray-400 disabled:border-gray-400 disabled:hover:cursor-not-allowed" handleClick={() => setGrade(s => s + 1)}>+</Button>
                </div>
                
                <label>Votre avis</label>
                <textarea className="p-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={opinion} onChange={(event) => setOpinion(event.target.value)} rows={4} />

                {isSuccess !== null && (
                    <div className={isSuccess ? "text-green-500" : "text-red-400"}>
                        {isSuccess ? <p>Avis posté</p> : <p>{error}</p>}
                    </div>
                )}
                <Button style="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:bg-slate-700 disabled:text-white disabled:hover:bg-slate-800 disabled:cursor-not-allowed hover:bg-blue-700" isDisable={grade <= 0 ? true : false} handleClick={() => handleSaveForm()}>Enregistrer</Button>
            </form>
        </div>
    )
}