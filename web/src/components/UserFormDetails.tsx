import { useEffect, useState } from 'react';
import Button from './Button'
import {UseTheme} from '../hooks/Theme'
import {MeDB} from '../services/RequestsDb'
import { URL_API } from '../utils/Links'
import {useAuth} from '../context/AuthContext'
import {type FavoritesResponse, type FavoriteResponse, type Statut} from '../types/api'
import notFavoriteImg from '../assets/etoile_vide.png'
import favoriteImg from '../assets/etoile.png'
type StateType = Statut

interface UserFormDetailsprops {
    gameId: number
    state: StateType
    setState: (value: StateType) => void
    canSave: boolean | null
}

export default function UserFormDetails ({gameId, state, setState, canSave}: UserFormDetailsprops) {
    const [grade, setGrade] = useState<number>(0)
    const [opinion, setOpinion] = useState<string>("")
    const [date, setDate] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null)
    
    // Hook Theme
    const { theme } = UseTheme()

    // hook Auth
    const {auth, setAuth} = useAuth()

    const isFavorite = auth?.favorites.some(game => game.id === gameId) !== undefined && auth?.favorites.some(game => game.id === gameId) !== null ? true : false

    // Sauvegarde du formulaire
    async function handleSaveForm () {
        // Vérif entrées
        if (grade < 0 || grade > 5) {
            setError("La note doit être comprise entre 1 et 5")
            setIsSuccess(false)
            return
        }

        // Si pas d'utilisateur
        if (!auth) {
            return
        }

        if (!auth.favorites.some(game => game.id === gameId)) {
            setIsSuccess(false)
            setError("Veuillez d'abord mettre le jeu en favoris")
            return
        }

        setError("")
        setIsSuccess(null)

        // Save dans la bdd
        const createdAt = new Date().toLocaleString();
        const response = await MeDB<FavoriteResponse>({url: `${URL_API}/me/collection/${gameId}`, methodToSend: 'PATCH', token: auth.token, dataToSend: JSON.stringify({ opinion, grade: grade === 0 ? undefined : grade, state, date: createdAt })})
    
        if (response.responseType === "Success") {
            if (response.favorites) {
                setAuth({...auth, favorites: response.favorites})
            }
            setDate(createdAt)
            setIsSuccess(true)
        } else {
            setIsSuccess(false)
            setError(response.error === null || response.error === undefined ? "Erreur lors de l'enregistrement" : response.error)
        }
    }

    // Récup infos bdd
    useEffect(() => {
        // Vérif connecté
        if (!auth) {
            return
        }

        const getBdd = async () => {
            // Vérif favoris
            if (isFavorite === false) {
                setIsSuccess(false)
                setError("Veuillez d'abord mettre le jeu en favoris")
                return
            }

            // Reset
            setError("")
            setIsSuccess(null)

            const response = await MeDB<FavoritesResponse>({url: `${URL_API}/me/collection`, methodToSend: 'GET', token: auth.token})

            if (response.responseType === "Success" && response.dataToResponse) {
                // Chercher le jeu dans le tableau du serv
                const favorite = response.dataToResponse.favorites.find(game => game.id === gameId)

                // Vérif s'il existe
                if (!favorite) {
                    setIsSuccess(false)
                    setError("Veuillez d'abord mettre le jeu en favoris")
                    return
                }

                setGrade(favorite.grade === null || favorite.grade === undefined ? 0 : favorite.grade)
                setOpinion(favorite.opinion === null || favorite.opinion === undefined ? "" : favorite.opinion)
                setState(favorite.state === null || favorite.state === undefined ? "a_decouvrir" : favorite.state)
                setDate(favorite.date === null || favorite.date === undefined ? "" : favorite.date)
                setError("")
            } else {
                setIsSuccess(false)
                setError(response.error === null || response.error === undefined ? "Erreur de connexion au serveur" : response.error)
            }
        }

        getBdd()
    }, [auth?.token, gameId, isFavorite])

    return (
        <div className={`w-full mt-4 relative pt-8 max-w-3xl lg:mb-30 flex flex-col p-6 rounded-lg border ${theme === "dark" ? "border-black bg-white text-gray-800" : "border-white bg-slate-600 text-white" }`}>
            <h1 className="text-xl font-semibold text-center mb-2">Votre mémo sur le jeu</h1>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col font-medium gap-3">

                <label>Note :</label>
                <div className="flex flex-row gap-3">
                    <Button isDisable={grade <= 1 ? true : false} style="w-7 h-7 bg-blue-600 rounded-full border border-blue-600 hover:bg-blue-700 hover:border-white disabled:bg-gray-400 disabled:border-gray-400 disabled:hover:cursor-not-allowed" handleClick={() => setGrade(s => s - 1)}>-</Button>
                    <div className="flex flex-row gap-3">
                        {[1, 2, 3, 4, 5].map(star => (
                            <img key={star} src={star <= grade ? favoriteImg : notFavoriteImg } alt={`${star}`} className="w-7 h-7" />
                        ))}
                    </div>
                    <Button isDisable={grade >= 5 ? true : false} style="w-7 h-7 bg-blue-600 rounded-full border border-blue-600 hover:bg-blue-700 hover:border-white disabled:bg-gray-400 disabled:border-gray-400 disabled:hover:cursor-not-allowed" handleClick={() => setGrade(s => s + 1)}>+</Button>
                </div>
                
                <label>Votre avis</label>
                <textarea className="p-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" value={opinion} onChange={(event) => setOpinion(event.target.value)} rows={4} />

                {date !== "" && (<label>Mis à jour le {date.split(" ")[0]} à {date.split(" ")[1]}</label>)}

                {isSuccess !== null && (
                    <div className={isSuccess  === true ? "text-green-500" : "text-red-400"}>
                        {isSuccess === true ? <p>Sauvegardé</p> : <p>{error}</p>}
                    </div>
                )}
                <Button style="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:bg-slate-700 disabled:text-white disabled:hover:bg-slate-800 disabled:cursor-not-allowed hover:bg-blue-700" isDisable={!isFavorite} handleClick={() => handleSaveForm()}>Enregistrer</Button>
            </form>
        </div>
    )
}