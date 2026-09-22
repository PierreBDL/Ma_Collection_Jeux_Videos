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
            className={`flex h-full min-h-65 flex-col rounded-xl border p-5 text-left transition duration-200 hover:-translate-y-1 
                ${auth != null && auth.favorites.filter(favoriteGame => favoriteGame.id === id).length > 0 ? (
                    theme === "light" ? "border-yellow-300 bg-slate-300 hover:border-yellow-500" : "border-yellow-700 bg-gray-950 hover:border-yellow-500"
                ) : (
                    theme === "light" ? "border-slate-300 bg-slate-100 hover:border-blue-300" : "border-slate-700 bg-slate-900 hover:border-blue-400"
                )}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className={`max-w-[70%] text-lg font-bold ${theme === "light" ? "text-slate-900" : "text-white"}`}>{nom}</h3>
                <span className={`max-w-[30%] rounded-full px-2.5 py-1 text-[11px] font-bold ${theme === "light" ? "bg-blue-50 text-blue-700" : "bg-slate-800 text-blue-300"}`}>{annee}</span>
            </div>

            <p className="mb-2 text-sm font-semibold text-violet-500">{genre}</p>
            <p className={`mb-5 text-sm ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>Par <span className={`font-semibold ${theme === "light" ? "text-slate-900" : "text-white"}`}>{studio}</span></p>

            <div className="mt-auto">
                <p className={`inline-flex w-auto rounded-full px-3 py-1.5 text-xs font-bold uppercase ${theme === "light" ? "bg-slate-300 text-slate-700" : "bg-slate-800 text-slate-200"}`}>{plateforme}</p>
            </div>

            <Button style="mt-5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700" handleClick={() => handleDetails(id)} isDisable={false}>Plus d'infos</Button>
        </article>
    )
}