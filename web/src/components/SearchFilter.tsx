import Button from './Button'
import {type searchType, gameType, gamePlateforme} from '../types/SearchType'

interface SearchFilterProps {
    search: string
    searchFunction: (value: string) => void
    searchOrigin: searchType
    searchOriginFunction: (value: searchType) => void
}

export default function SearchFilter ({search, searchFunction, searchOrigin, searchOriginFunction}: SearchFilterProps) {
    const handleFilter = (filter: string) => {
        if (search === filter && searchOrigin === "byFilters") {
            searchOriginFunction("bySearchBar")
            searchFunction("")
        } else {
            searchOriginFunction("byFilters")
            searchFunction(filter)
        }
    }

    return (
        <div className="top-4 z-10 w-full max-w-md mx-auto mb-8">
            <div className="w-full max-w-md mx-auto flex flex-row gap-1.5">
                <h3 className="block text-xs font-semibold uppercase text-slate-500 mb-1.5 ml-1">Filtres</h3>
            </div>

            <div>
                <span className="block text-mg font-medium text-slate-600 mb-1">Type</span>
                <div className="w-full max-w-md mx-auto flex flex-row gap-1.5">
                    {
                        gameType.map(filter => (
                            <Button key={filter} 
                            style={search === filter ? 
                                "p-2 px-4 bg-slate-500 rounded-lg mt-2 text-white font-medium text-sm transition-colors cursor-pointer" 
                                : "p-2 px-4 bg-blue-400 rounded-lg mt-2 text-white font-medium text-sm transition-colors cursor-pointer"} 
                                isDisable={false} 
                                handleClick={() => handleFilter(filter)}>{filter.toUpperCase()}</Button>
                        ))
                    }
                </div>
            </div>

            <br />
            
            <div>
                <span className="block text-mg font-medium text-slate-600 mb-1">Plateforme</span>
                <div className="w-full max-w-md mx-auto flex flex-row gap-1.5">
                    {
                        gamePlateforme.map(filter => (
                            <Button key={filter} 
                            style={search === filter ? 
                                "p-2 px-4 bg-slate-500 rounded-lg mt-2 text-white font-medium text-sm transition-colors cursor-pointer" 
                                : "p-2 px-4 bg-blue-400 rounded-lg mt-2 text-white font-medium text-sm transition-colors cursor-pointer"} 
                                isDisable={false} 
                                handleClick={() => handleFilter(filter)}>{filter.toUpperCase()}</Button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}