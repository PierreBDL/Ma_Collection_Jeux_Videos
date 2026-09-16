import '../css/Register.css'
import {useState} from 'react'

export default function RegisterPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    return (
        <div className="register-page">
            <h1>Inscription</h1>
            <form>
                <label>Email :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Mot de passe :</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="button">S'inscrire</button>
            </form>
        </div>
    )
}