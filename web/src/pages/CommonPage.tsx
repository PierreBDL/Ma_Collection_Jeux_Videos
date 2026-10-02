import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react';

import { UseTheme } from '../hooks/Theme'
import { useAuth } from '../context/Auth'

import Button from '../components/Button'
import SearchBar from '../components/SearchBar'

import soleilImg from '../assets/soleil.png'
import luneImg from '../assets/lune.png'
import burgerImg from '../assets/burger.png'
import closeBurgerImg from '../assets/close.png'
import bgImg from '../assets/bg-body.jpg'
import bgDarkImg from '../assets/bg-body-dark.jpg'
import avatarImg from '../assets/avatar.png'

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
        <div className={`relative min-h-screen text-whit"} flex flex-col`}
            style={{ backgroundImage: `url(${theme === "dark" ? bgImg : bgDarkImg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
            <header className={`relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 px-6 py-4 md:grid-cols-3 bg-black text-white`}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="w-full h-full flex items-center justify-start gap-12">
                    <Button style="bg-white w-12 h-12 p-2 rounded-2xl mt-2 hover:bg-blue-100 font-medium text-sm transition-colors cursor-pointer" isDisable={false} handleClick={ToggleTheme}>
                        {
                            theme === "dark"
                                ? (<img className="w-7 h-auto flex self-center place-self-center" alt="Thème sombre" src={luneImg}></img>)
                                : (<img className="w-7 h-auto flex self-center place-self-center" alt="Thème clair" src={soleilImg}></img>)
                        }
                    </Button>
                    <div className="w-max-[60%]">
                        <SearchBar />
                    </div>
                </div>

                <nav className="hidden items-center justify-center gap-6 md:flex">
                    <Link to="/" className="hover:text-blue-600 font-medium transition-colors">Accueil</Link>
                    <Link to="/myLibrary" className="hover:text-blue-600 font-medium transition-colors">Ma bibliothèque</Link>
                    {
                        auth !== null ? (<Link to="/stats" className="hover:text-blue-600 font-medium transition-colors">Mes stats</Link>) : (null)
                    }
                </nav>

                <div className="hidden items-center justify-end md:flex">
                    {auth?.name != null && auth.name != "" ? (
                        <div className="w-auto flex flex-row gap-4 justify-self-end place-self-center">
                            <div className="flex flex-row gap-2">
                                <div className="w-7 h-7 bg-white rounded-full flex justify-center p-2 border-black border">
                                    <img src={avatarImg} className="w-full h-full" alt="Avatar" />
                                </div>
                                <p className={`text-white`}>{username}</p>
                            </div>
                            <Button style="p-1.5 px-2.5 rounded text-sm text-white bg-red-600 hover:bg-red-800 cursor-pointer" isDisable={false} handleClick={() => handleLogout()}>Se déconnecter</Button>
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
                <div className="col-start-2 row-start-1 flex items-center justify-end md:hidden">
                    <Button style="bg-white rounded-xl p-2 max-w-[50px] max-h-[50px]" isDisable={false} handleClick={() => toggleMenu()}>
                        {
                            menuIsOpen ? (<img src={closeBurgerImg} alt="Menu" />) : (<img src={burgerImg} alt="Menu" />)
                        }
                    </Button>
                </div>

                {menuIsOpen && (
                    <nav className={`absolute justify-end ${theme === "dark" ? "bg-slate-800" : "bg-slate-800"} top-full right-0 w-full z-50 flex flex-col p-6 space-y-4 md:hidden`}>
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