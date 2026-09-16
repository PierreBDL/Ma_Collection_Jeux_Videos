import '../css/Register.css'

export default function RegisterPage() {
    return (
        <main className="register-page">
            <h1>Inscription</h1>
            <form>
                <label>Email :</label>
                <input type="email" id="email" name="email" required />
                <label>Mot de passe :</label>
                <input type="password" id="password" name="password" required />

                <button type="submit">S'inscrire</button>
            </form>
        </main>
    )
}