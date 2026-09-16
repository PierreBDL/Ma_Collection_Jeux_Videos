import type { JeuxProps } from '../interfaces/gameInt'

export default function GameCard ({ nom, studio, plateforme, annee, genre }: JeuxProps) {
    return (
        <article className="flex h-full min-h-52 flex-col rounded-xl border border-gray-300 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-blue-300">
            <div className="mb-4 flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">{nom}</h3>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{annee}</span>
            </div>

            <p className="mb-2 text-sm font-medium text-violet-600">{genre}</p>
            <p className="mb-5 text-sm text-gray-700">Par <span className="font-semibold text-gray-800">{studio}</span></p>

            <p className="mt-auto w-24 text-center rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-gray-700">{plateforme}</p>
        </article>
    )
}