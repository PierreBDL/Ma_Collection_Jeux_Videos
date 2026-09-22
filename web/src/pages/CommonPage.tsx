import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ThemeProvider, UseTheme } from '../../context/Theme'
import Button from '../components/Button'

import soleilImg from '../assets/soleil.png'
import luneImg from '../assets/lune.png'
import mascotteImg from '../assets/logo.png'

export default function CommonPage() {
    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    // Hook navigate
    const navigate = useNavigate()

    // Retour à l'accueil
    function returnHome () {
        navigate("/")
    }

    return (
        <div className={`min-h-screen ${theme === "light" ? "bg-white text-gray-800" : "bg-black text-white"} flex flex-col`}>
            <header className={`flex justify-around p-4 ${theme === "light" ? "bg-white text-gray-600" : "bg-black text-white"} shadow-sm gap-7`}>
                <div>
                    <Button style={`w-auto h-15 rounded-2xl mt-2 hover:${theme === "light" ? "bg-gray-950" : "bg-white"} font-medium text-sm transition-colors cursor-pointer`} isDisable={false} handleClick={returnHome}>
                        <img className={`${theme === "light" ? "bg-gray-300" : "bg-gray-950"} rounded-2xl w-auto h-15 object-contain`} src={mascotteImg} alt="Retour à l'accueil" />
                    </Button>
                </div>
                
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
                                ? (<img className="w-7 h-7 flex self-center place-self-center" alt="Thème sombre" src={luneImg}></img>)
                                : (<img className="w-7 h-7 flex self-center place-self-center" alt="Thème clair" src={soleilImg}></img>)
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