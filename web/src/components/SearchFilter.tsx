import { type searchType, gameType, gamePlateforme } from '../types/SearchType'
import { UseTheme } from '../hooks/Theme'

interface SearchFilterProps {
    search: string
    searchFunction: (value: string) => void
    searchOrigin: searchType
    searchOriginFunction: (value: searchType) => void
}

export default function SearchFilter({ search, searchFunction, searchOrigin, searchOriginFunction }: SearchFilterProps) {
    const { theme } = UseTheme()
    const selectedType = searchOrigin === "byFilters" && gameType.includes(search) ? search : ""
    const selectedPlatform = searchOrigin === "byFilters" && gamePlateforme.includes(search) ? search : ""

    const handleFilter = (filter: string) => {
        if (filter === "") {
            searchOriginFunction("bySearchBar")
            searchFunction("")
        } else {
            searchOriginFunction("byFilters")
            searchFunction(filter)
        }
    }

    return (
        <section className={`mx-auto mb-8 w-full max-w-3xl rounded-lg border p-4 shadow-sm sm:p-5 ${theme === "light" ? "border-white bg-slate-800 text-white" : "border-white bg-slate-200 text-slate-900"}`}>
            <h3 className={`mb-4 text-xs font-bold uppercase tracking-wider ${theme === "light" ? "text-slate-300" : "text-black"}`}>Filtres</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                    Type
                    <select value={selectedType} onChange={(e) => handleFilter(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === "light" ? "border-slate-600 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-900"}`}>
                        <option value="">Tous</option>
                        {gameType.map(filter => (
                            <option key={filter} value={filter}>{filter}</option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm font-medium">
                    Plateforme
                    <select value={selectedPlatform} onChange={(e) => handleFilter(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === "light" ? "border-slate-600 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-900"}`}>
                        <option value="">Tous</option>
                        {gamePlateforme.map(filter => (
                            <option key={filter} value={filter}>{filter}</option>
                        ))}
                    </select>
                </label>
            </div>
        </section>
    )
}