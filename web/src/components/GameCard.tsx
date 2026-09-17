import type { JeuxProps } from '../interfaces/gameInt'
import {UseTheme} from '../hooks/Theme'

export default function GameCard ({ nom, studio, plateforme, annee, genre }: JeuxProps) {

    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    return (
        <article className={`flex h-full min-h-52 flex-col rounded-xl border p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-blue-300 ${theme === "light" ? "border-gray-300 bg-white" : "border-gray-700 bg-gray-900"}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className={`text-lg font-bold ${theme === "light" ? "text-black" : "text-white"}`}>{nom}</h3>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${theme === "light" ? "bg-blue-50 text-blue-700" : "bg-black text-blue-300"}`}>{annee}</span>
            </div>

            <p className="mb-2 text-sm font-medium text-violet-600">{genre}</p>
            <p className={`mb-5 text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Par <span className={`font-semibold ${theme === "light" ? "text-black" : "text-gray-100"}`}>{studio}</span></p>

            <p className={`mt-auto w-24 text-center rounded-lg px-3 py-2 text-sm font-semibold ${theme === "light" ? "bg-slate-200 text-gray-700" : "bg-black text-gray-200"}`}>{plateforme}</p>
        </article>
    )
}