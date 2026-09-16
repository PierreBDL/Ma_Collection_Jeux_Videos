import Button from './Button'
import Effacer from '../assets/effacer.png'
import {type searchType, filtersType} from '../interfaces/SearchType'

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
            <div className="w-full max-w-md mx-auto flex flex-row gap-1.5">
                {
                    filtersType.map(filter => (
                        <Button key={filter} 
                        style={search === filter ? 
                            "p-2 bg-red-400 rounded-lg mt-2 text-white font-medium text-sm transition-colors cursor-pointer" 
                            : "p-2 bg-blue-400 rounded-lg mt-2 text-white font-medium text-sm transition-colors cursor-pointer"} 
                            isDisable={false} 
                            handleClick={() => handleFilter(filter)}>{filter.toUpperCase()}</Button>
                    ))
                }
            </div>
        </div>
    )
}