import { Link, Outlet } from 'react-router-dom'
import { ThemeProvider, UseTheme } from '../hooks/Theme'
import Button from '../components/Button'

import soleilImg from '../assets/soleil.png'
import luneImg from '../assets/lune.png'

export default function CommonPage() {
    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    return (
        <div className={`min-h-screen ${theme === "light" ? "bg-white text-gray-800" : "bg-black text-white"} flex flex-col`}>
            <header className={`flex p-4 ${theme === "light" ? "bg-white text-gray-600" : "bg-black text-white"} shadow-sm gap-7`}>
                <nav className="flex gap-6 max-w-4xl mx-auto">
                    <Link to="/" className="hover:text-blue-600 font-medium transition-colors">Accueil</Link>
                    <Link to="/register" className="hover:text-blue-600 font-medium transition-colors">S'inscrire</Link>
                    <Link to="/login" className="hover:text-blue-600 font-medium transition-colors">Se connecter</Link>
                    <Link to="/games" className="hover:text-blue-600 font-medium transition-colors">Ma librarie</Link>
                </nav>

                <div>
                    <Button style="bg-white w-12 h-12 rounded-2xl mt-2 hover:bg-blue-100 font-medium text-sm transition-colors cursor-pointer" isDisable={false} handleClick={ToggleTheme}>
                        {
                            theme === "light"
                                ? (<img className="w-7 h-7 flex self-center place-self-center" src={luneImg}></img>)
                                : (<img className="w-7 h-7 flex self-center place-self-center" src={soleilImg}></img>)
                        }
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start p-4">
                <Outlet />
            </main>
        </div>
    )
}