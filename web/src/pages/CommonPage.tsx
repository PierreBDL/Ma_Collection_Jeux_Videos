import { Link, Outlet } from 'react-router-dom'
import '../css/Common.css'

export default function CommonPage () {
    return (
        <body>
            <header>
                <nav>
                    <Link to="/">Accueil</Link>
                    <Link to="/register">S'inscrire</Link>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </body>
    )
}