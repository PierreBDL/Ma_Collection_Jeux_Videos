import {createContext, useContext, useState, type ReactNode} from 'react'
import { type searchType } from '../types/SearchType'

interface SearchValue {
    search: string,
    setSearch: (value: string) => void,
    searchOrigin: searchType,
    setSearchOrigin: (value: searchType) => void
}

const searchContext = createContext<SearchValue | undefined>(undefined)

/* ---------------------
        Provider
----------------------*/

export function SearchProvider ({children}: {children: ReactNode}) {
    const [search, setSearch] = useState<string>('')
    const [searchOrigin, setSearchOrigin] = useState<searchType>('bySearchBar')

    return (
        <searchContext.Provider value={{search, setSearch, searchOrigin, setSearchOrigin}}>
            {children}
        </searchContext.Provider>
    )
}

/* ---------------------
        UseSearch
----------------------*/


export function UseSearch () {
  const ctx = useContext(searchContext);
  if (!ctx) {
    throw new Error("Pas de provider pour la recherche")
  }
  return ctx
}
