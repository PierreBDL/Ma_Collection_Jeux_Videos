import { Link, Outlet } from 'react-router-dom'
import '../css/Common.css'

export default function Common () {
    return (
        <body>
            <header>
                <nav>
                    <Link to="/">Home</Link>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </body>
    )
}