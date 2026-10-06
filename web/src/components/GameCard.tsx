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
            color: theme === "dark" ? "bg-blue-900 text-white" : "bg-blue-300 text-black",
        },
        "en_cours": {
            label: "En cours",
            color: theme === "dark" ? "bg-orange-900 text-white" : "bg-orange-300 text-black",
        },
        "termine": {
            label: "Terminé",
            color: theme === "dark" ? "bg-green-900 text-white" : "bg-green-300 text-black",
        }
    }


    return (
        <article className={`flex h-full min-h-65 flex-col border rounded-xl p-5 text-left hover:-translate-y-1 
                ${isMyLibrary === false && auth != null && auth.favorites.filter(favoriteGame => favoriteGame.id === id).length > 0 ? (
                    theme === "dark" ? "bg-mist-400 border-black" : "border-white bg-gray-950"
                ) : (
                    theme === "dark" ? "bg-slate-200 border-black" : "border-white bg-slate-900"
                )}`}>

            {
                isMyLibrary != undefined && isMyLibrary === true ? (
                    <p className={`mb-5 w-full text-center place-self-center items-center gap-2 rounded-md border px-3 py-1.5 font-semibold ${state && states[state] ? states[state].color : null}`}>
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