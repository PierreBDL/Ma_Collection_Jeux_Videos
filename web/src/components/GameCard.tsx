import { useNavigate } from 'react-router-dom';

import type { JeuxProps } from '../interfaces/gameInt'
import {UseTheme} from '../hooks/Theme'
import {useAuth} from '../context/Auth'
import Button from './Button';

export default function GameCard ({id, nom, studio, plateforme, annee, genre }: JeuxProps) {

    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()
    
    // Hook auth
    const {auth, setAuth} = useAuth()

    /* ------------------------
            Plus d'infos
    -------------------------*/

    const navigate = useNavigate()

    function handleDetails (id: number) {
        navigate(`/details/${id}`)
    }


    return (
        <article 
            className={`flex h-full min-h-52 flex-col rounded-xl border p-5 text-left transition duration-200 hover:-translate-y-1 
                ${auth != null && auth.favorites.filter(favoriteGame => favoriteGame.id === id).length > 0 ? (
                    theme === "light" ? "hover:border-yellow-800 border-yellow-600 bg-white" : "hover:border-yellow-800 border-yellow-600 bg-gray-900"
                ) : (
                    theme === "light" ? "hover:border-blue-300 border-gray-300 bg-white" : "hover:border-blue-300 border-gray-700 bg-gray-900"
                )}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className={`text-lg font-bold ${theme === "light" ? "text-black" : "text-white"}`}>{nom}</h3>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${theme === "light" ? "bg-blue-50 text-blue-700" : "bg-black text-blue-300"}`}>{annee}</span>
            </div>

            <p className="mb-2 text-sm font-medium text-violet-600">{genre}</p>
            <p className={`mb-5 text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Par <span className={`font-semibold ${theme === "light" ? "text-black" : "text-gray-100"}`}>{studio}</span></p>

            <p className={`mt-auto w-24 text-center rounded-lg px-3 py-2 text-sm font-semibold ${theme === "light" ? "bg-slate-200 text-gray-700" : "bg-black text-gray-200"}`}>{plateforme}</p>

            <Button style="rounded-lg mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer" handleClick={() => handleDetails(id)} isDisable={false}>Plus d'infos</Button>
        </article>
    )
}