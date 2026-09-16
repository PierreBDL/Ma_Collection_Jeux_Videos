import Button from './Button'
import Effacer from '../assets/effacer.png'

interface SearchBarProps {
    search: string
    searchFunction: (value: string) => void
}

export default function SearchBar ({search, searchFunction}: SearchBarProps) {
    return (
        <div className="sticky top-4 z-10 w-full max-w-md mx-auto mb-8">
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5 ml-1">Recherche</label>
            <div className="w-full max-w-md mx-auto flex flex-row gap-1.5">
                <input placeholder="Rechercher un jeu..." className="w-full px-10 py-2.5 border placeholder-slate-400 border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" type="text" value={search} onChange={(e) => searchFunction(e.target.value)} />
                <Button handleClick={() => searchFunction("")} isDisable={false} style="w-7 h-7 rounded-lg mt-2 hover:bg-red-100 text-white font-medium text-sm transition-colors cursor-pointer">
                    <img src={Effacer} alt="Vider"></img>
                </Button>
            </div>
        </div>
    )
}