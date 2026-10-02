import Button from './Button'
import Effacer from '../assets/effacer.png'
import { UseSearch } from '../hooks/Research'
import { UseTheme } from '../hooks/Theme'

export default function SearchBar() {
    const { search, setSearch, searchOrigin, setSearchOrigin } = UseSearch()
    
    // Hook Theme
    const { theme } = UseTheme()

    return (
        <div className="col-span-2 row-start-2 w-full max-w-md md:col-span-1 md:row-auto md:justify-self-center">
            <label className={`block text-xs font-semibold uppercase ${theme === "dark" ? "text-white" : "text-slate-500"} mb-1.5 ml-1`}>Recherche</label>
            <div className="flex w-full flex-row gap-1.5">
                <input placeholder="Rechercher un jeu..." 
                    className={`w-full rounded-xl border ${theme === "light" ? "border-gray-400 placeholder-slate-400" : "border-white placeholder-white"} px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`} 
                    type="text" value={searchOrigin === "bySearchBar" ? search : ""} onChange={(e) => {setSearch(e.target.value); setSearchOrigin("bySearchBar")}}/>
                <Button handleClick={() => {setSearch(""); setSearchOrigin("bySearchBar")}} isDisable={false}
                    style="w-7 rounded-lg hover:bg-red-100 text-white font-medium text-sm transition-colors cursor-pointer">
                    <img src={Effacer} alt="Vider"></img>
                </Button>
            </div>
        </div>
    )
}