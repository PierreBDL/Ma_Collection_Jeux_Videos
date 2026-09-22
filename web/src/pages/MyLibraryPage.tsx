import {useAuth} from '../context/Auth'
import {UseTheme} from '../hooks/Theme'
import GameCard from '../components/GameCard'

export default function MyLibraryPage () {

    // Hook Auth
    const { auth, setAuth } = useAuth()

    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    return (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <h2 className={`mb-6 text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Jeux actuellement en favoris</h2>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {
                    auth?.favorites.map(game => (
                        <li className="min-w-0" key={game.id}>
                            <GameCard id={game.id} nom={game.nom} studio={game.studio} plateforme={game.plateforme} annee={game.annee} genre={game.genre}></GameCard>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}