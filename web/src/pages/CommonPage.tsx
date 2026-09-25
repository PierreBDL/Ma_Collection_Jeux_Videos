import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react';

import { UseTheme } from '../hooks/Theme'
import { useAuth } from '../context/Auth'

import Button from '../components/Button'

import soleilImg from '../assets/soleil.png'
import luneImg from '../assets/lune.png'
import burgerImg from '../assets/burger.png'
import closeBurgerImg from '../assets/close.png'

export default function CommonPage() {
    // State pour le menu burger
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)

    function toggleMenu() {
        setMenuIsOpen(!menuIsOpen)
    }

    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    // Hook Auth
    const { auth, setAuth } = useAuth()

    // Hook navigate
    const navigate = useNavigate()

    // Majuscule sur l'initiale
    let username
    if (auth?.name) {
        username = auth?.name.charAt(0).toUpperCase() + auth?.name.slice(1);
    }

    // Déconnexion
    function handleLogout() {
        setAuth(null)
        navigate("/login")
    }

    return (
        <div className={`relative min-h-screen ${theme === "light" ? "bg-white text-gray-800" : "bg-black text-white"} flex flex-col`}>
            <header className={`relative grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center px-6 py-4 ${theme === "light" ? "bg-white text-gray-600" : "bg-black text-white"}`}>
                <div className="flex items-center justify-start">
                    <Button style="bg-white w-12 h-12 rounded-2xl mt-2 hover:bg-blue-100 font-medium text-sm transition-colors cursor-pointer" isDisable={false} handleClick={ToggleTheme}>
                        {
                            theme === "light"
                                ? (<img className="w-7 h-7 flex self-center place-self-center" alt="Thème sombre" src={luneImg}></img>)
                                : (<img className="w-7 h-7 flex self-center place-self-center" alt="Thème clair" src={soleilImg}></img>)
                        }
                    </Button>
                </div>

                <nav className="hidden md:flex items-center gap-6 justify-center">
                    <Link to="/" className="hover:text-blue-600 font-medium transition-colors">Accueil</Link>
                    <Link to="/myLibrary" className="hover:text-blue-600 font-medium transition-colors">Ma bibliothèque</Link>
                    <Link to="/stats" className="hover:text-blue-600 font-medium transition-colors">Mes stats</Link>
                </nav>

                <div className="hidden md:flex items-center justify-end">
                    {auth?.name != null && auth.name != "" ? (
                        <div className="w-auto flex flex-row gap-4 justify-self-end place-self-center">
                            <p className={`${theme === "light" ? "text-black" : "text-white"}`}>Connecté en tant que {username}</p>
                            <Button style="p-1 px-2 rounded text-sm text-white bg-red-600 hover:bg-red-800 cursor-pointer" isDisable={false} handleClick={() => handleLogout()}>Se déconnecter</Button>
                        </div>
                    ) : (
                        <div className="flex flex-raw space-x-4">
                            <Link to="/register" className="hover:text-blue-600 font-medium transition-colors">S'inscrire</Link>
                            <Link to="/login" className="hover:text-blue-600 font-medium transition-colors">Se connecter</Link>
                        </div>
                    )
                    }
                </div>

                {/* Menu burger */}
                <div className="md:hidden flex items-center justify-end">
                    <Button style="bg-white rounded-xl p-2 max-w-[50px] max-h-[50px]" isDisable={false} handleClick={() => toggleMenu()}>
                        {
                            menuIsOpen ? (<img src={closeBurgerImg} alt="Menu" />) : (<img src={burgerImg} alt="Menu" />)
                        }
                    </Button>
                </div>

                {menuIsOpen && (
                    <nav className={`absolute justify-end ${theme === "dark" ? "bg-slate-800" : "bg-slate-300"} top-full right-0 w-full z-50 flex flex-col p-6 space-y-4 md:hidden`}>
                        <Link onClick={() => toggleMenu()} to="/" className="hover:text-blue-600 font-medium transition-colors">Accueil</Link>
                        <Link onClick={() => toggleMenu()} to="/myLibrary" className="hover:text-blue-600 font-medium transition-colors">Ma bibliothèque</Link>
                        <Link onClick={() => toggleMenu()} to="/stats" className="hover:text-blue-600 font-medium transition-colors">Mes stats</Link>
                        {
                            auth !== null ? (<Button style="p-1 px-2 rounded text-sm text-white bg-red-600 hover:bg-red-800 cursor-pointer" isDisable={false} handleClick={() => handleLogout()}>Se déconnecter</Button>) 
                            : (
                                <div className="flex flex-col space-y-4">
                                    <Link onClick={() => toggleMenu()} to="/register" className="hover:text-blue-600 font-medium transition-colors">S'inscrire</Link>
                                    <Link onClick={() => toggleMenu()} to="/login" className="hover:text-blue-600 font-medium transition-colors">Se connecter</Link>
                                </div>
                            )
                        }
                    </nav>
                )}
            </header>

            <main className="flex-1 flex flex-col items-center justify-start p-4">
                <Outlet />
            </main>
        </div>
    )
}




/* Logo vers l'accueil :
<Button style={`w-auto h-15 rounded-2xl mt-2 hover:${theme === "light" ? "bg-gray-950" : "bg-white"} font-medium text-sm transition-colors cursor-pointer`} isDisable={false} handleClick={returnHome}>
    <img className={`${theme === "light" ? "bg-gray-300" : "bg-gray-950"} rounded-2xl w-auto h-15 object-contain`} src={mascotteImg} alt="Retour à l'accueil" />
</Button>

    // Retour à l'accueil
    function returnHome() {
        navigate("/")
    }


    import mascotteImg from '../assets/logo.png'
    */