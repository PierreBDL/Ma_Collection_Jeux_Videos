import {useState} from 'react'
import Form from '../components/Form'

export default function LoginPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")

    const fonctions = {setEmail, setPassword}
    const values = {email, password}

    function loginCheck () {
        if (email.trim() === "") {
            setError("Courriel obligatoire")
        }
        if (!email.includes("@")) {
            setError("L'email doit contenir un @")
        }

        // Tests
        if (email === "test@test" && password === "test") {
            setError("Connecté")
        } else {
            setError("Informations incorrectes")
        }
    }

    return (
        <div className="p-4 bg-white border-solid border-gray-800">
            <Form title="Se connecter" setters={fonctions} getters={values} action={loginCheck} error={error}></Form>
        </div>
    )
}