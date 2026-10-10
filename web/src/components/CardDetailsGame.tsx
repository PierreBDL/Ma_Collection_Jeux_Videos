import Button from '../components/Button'
import {UseTheme} from '../hooks/Theme'
import {useAuth} from '../context/AuthContext'

import notFavoriteImg from '../assets/etoile_vide.png'
import favoriteImg from '../assets/etoile.png'

type StateGame = "a_decouvrir" | "en_cours" | "termine"

interface MoreDetailsProps {
    state: StateGame
    setState: (value: StateGame) => void
    grade?: number
    opinion?: string
    date?: string
    id: number
    nom: string
    studio: string
    plateforme: string
    genre: string
    annee: string
    image: string
    description: string
    handleFavorite: () => void
    canSaveFunc: (value: boolean) => void
}

export default function CardDetailsGame ({state, setState, grade, opinion, date, id, nom, studio, plateforme, genre, annee, image, description, handleFavorite, canSaveFunc}: MoreDetailsProps) {
    
    // Hook Theme
    const { theme } = UseTheme()

    // Hook Auth
    const {auth} = useAuth()
    
    return (
        <div className="relative pt-8 max-w-3xl lg:mb-30">
                <div className={`absolute h-8 top-0 right-0 px-4 py-1 text-center mx-auto border ${theme === "dark" ? "border-black bg-white text-gray-800" : "border-white bg-slate-600 text-white" } rounded-t-2xl`}>
                    <select name="state" value={state} onChange={(e) => {setState(e.target.value as StateGame); canSaveFunc(true)}}
                    >
                        <option value="a_decouvrir" className={`${theme === "dark" ? "text-white bg-slate-400" : "text-white bg-slate-800"}`} defaultChecked >A découvrir</option>
                        <option value="en_cours" className={`${theme === "dark" ? "text-white bg-slate-400" : "text-white bg-slate-800"}`} >En cours</option>
                        <option value="termine" className={`${theme === "dark" ? "text-white bg-slate-400" : "text-white bg-slate-800"}`} >Terminé</option>
                    </select>
                </div>
                <div className={`relative p-9 pb-10 max-w-4xlmx-auto border  ${theme === "dark" ? "border-black bg-white text-gray-800" : "border-white bg-slate-600 text-white" } rounded-b-2xl rounded-tl-2xl`}>
                    <div className="flex flex-raw justify-between mb-3">
                        <div className={`flex flex-col ${theme === "dark" ? "text-black" : "text-white"}`}>
                            <h1 className={`text-3xl font-bold mb-4`}>{nom}</h1>
                            <p className={`mb-2`}><strong>Studio :</strong> {studio}</p>
                            <p className={`mb-2`}><strong>Plateforme :</strong> {plateforme}</p>
                            <p className={`mb-2`}><strong>Catégorie :</strong> {genre}</p>
                            <p className={`mb-2`}><strong>Année :</strong> {annee}</p>
                        </div>
                        <div>
                            <img src={`/images/${image}`} className="w-80 h-auto max-h-40 rounded-lg mb-4 mr-4"></img>
                        </div>
                    </div>
                    <p className="mt-4"><strong>Description :</strong> {description}</p>

                    <Button style="absolute bg-gray-400 bottom-5 right-5 w-9 h-9 rounded-2xl mt-2 hover:bg-slate-300 font-medium text-sm transition-colors cursor-pointer" 
                            handleClick={() => handleFavorite()} isDisable={false}>
                        {
                            // Gestion logo
                            (auth != null && auth.favorites.filter(favoriteGame => favoriteGame.id === id).length > 0) ? (
                                <img className="w-6 h-6 flex place-self-center justify-self-center" src={favoriteImg} alt="Retirer des favoris" />
                            ) : (
                                <img className="w-6 h-6 flex place-self-center justify-self-center" src={notFavoriteImg} alt="Ajouter aux favoris" />
                            )
                        }
                    </Button>
                </div>
            </div>
    )
}