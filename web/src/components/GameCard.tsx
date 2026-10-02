import { useNavigate } from 'react-router-dom';

import type { JeuxProps } from '../interfaces/gameInt'
import { UseTheme } from '../hooks/Theme'
import { useAuth } from '../context/Auth'
import Button from './Button';

export default function GameCard({ id, nom, image, studio, plateforme, annee, genre, opinion, grade, state, isMyLibrary = false }: JeuxProps & { isMyLibrary?: boolean }) {

    // Hook Theme
    const { theme } = UseTheme()

    // Hook auth
    const { auth } = useAuth()

    /* ------------------------
            Plus d'infos
    -------------------------*/

    const navigate = useNavigate()

    function handleDetails(id: number) {
        navigate(`/details/${id}`)
    }

    const states = {
        "a_decouvrir": {
            label: "À découvrir",
            color: theme === "dark" ? "border-blue-800 bg-blue-950 text-blue-200" : "border-blue-200 bg-blue-300 text-blue-800",
        },
        "en_cours": {
            label: "En cours",
            color: theme === "dark" ? "border-orange-800 bg-orange-950 text-orange-200" : "border-orange-200 bg-orange-300 text-orange-800",
        },
        "termine": {
            label: "Terminé",
            color: theme === "dark" ? "border-green-800 bg-green-950 text-green-200" : "border-green-200 bg-green-300 text-green-800",
        }
    }


    return (
        <article className={`flex h-full min-h-65 flex-col rounded-xl border p-5 text-left transition duration-200 hover:-translate-y-1 
                ${auth != null && auth.favorites.filter(favoriteGame => favoriteGame.id === id).length > 0 ? (
                    theme === "dark" ? "border-amber-200 bg-gray-400 hover:border-amber-400" : "border-amber-500 bg-gray-950 hover:border-amber-500"
                ) : (
                    theme === "dark" ? "border-slate-300 bg-slate-300 hover:border-blue-300" : "border-slate-700 bg-slate-900 hover:border-blue-400"
                )}`}>

            {
                isMyLibrary != undefined && isMyLibrary === true ? (
                    <p className={`mb-2 w-full text-center place-self-center items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold ${state && states[state] ? states[state].color : null}`}>
                        <span className={`p-1 ${state && states[state] ? states[state].color : null}`}> {state && states[state] ? states[state].label : "Pas d'état"} </span>
                    </p>
                ) : null
            }

            <img src={`/images/${image}`} className="w-full h-auto max-h-40 rounded-lg mb-4 mr-4"></img>
            <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className={`max-w-[80%] text-lg font-bold ${theme === "dark" ? "text-slate-900" : "text-white"}`}>{nom}</h3>
                <span className={`max-w-[30%] rounded-full px-2.5 py-1 text-[11px] font-bold ${theme === "dark" ? "bg-blue-50 text-blue-700" : "bg-slate-800 text-blue-300"}`}>{annee}</span>
            </div>

            <p className="mb-2 text-sm font-semibold text-violet-500">{genre}</p>
            <p className={`mb-5 text-sm ${theme === "dark" ? "text-slate-600" : "text-slate-300"}`}>Par <span className={`font-semibold ${theme === "dark" ? "text-slate-900" : "text-white"}`}>{studio}</span></p>

            <div className="mt-auto">
                <p className={`inline-flex w-auto rounded-full px-3 py-1.5 text-xs font-bold uppercase ${theme === "dark" ? "bg-slate-50 text-slate-700" : "bg-slate-800 text-slate-200"}`}>{plateforme}</p>
            </div>

            <Button style="mt-5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700" handleClick={() => handleDetails(id)} isDisable={false}>Plus d'infos</Button>
        </article>
    )
}