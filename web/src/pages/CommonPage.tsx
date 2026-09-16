import { Link, Outlet } from 'react-router-dom'

export default function CommonPage () {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
            <header className="p-4 bg-white shadow-sm">
                <nav className="flex gap-6 max-w-4xl mx-auto">
                    <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Accueil</Link>
                    <Link to="/register" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">S'inscrire</Link>
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Se connecter</Link>
                </nav>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <Outlet />
            </main>
        </div>
    )
}