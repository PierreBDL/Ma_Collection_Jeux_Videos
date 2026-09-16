import '../css/Login.css'
import {useState} from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    return (
        <div className="login-page">
            <h1>Se connecter</h1>
            <form>
                <label>Email :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Mot de passe :</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="button">Se connecter</button>
            </form>
        </div>
    )
}