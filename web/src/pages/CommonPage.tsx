import { Link, Outlet } from 'react-router-dom'
import '../css/Common.css'

export default function CommonPage () {
    return (
        <div className="bodyDiv">
            <header>
                <nav>
                    <Link to="/">Accueil</Link>
                    <Link to="/register">S'inscrire</Link>
                    <Link to="/login">Se connecter</Link>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    )
}