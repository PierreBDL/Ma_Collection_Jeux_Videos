import {useState} from 'react'
import Form from '../components/Form'

export default function RegisterPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")

    const fonctions = {setEmail, setPassword}
    const values = {email, password}

    function submitCheck () {
        if (!email.includes("@")) {
            setError("L'email doit contenir un @")
            return
        }

        if (!email.includes(".")) {
            setError("L'email est invalide")
            return
        }

        if (password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères")
            return
        }

        // Tests
        if (email.includes("@") && password.length >= 8) {
            setError("C'est bon !")
            return
        }
    }

    return (
        <div className="w-full flex-1 flex justify-center items-center">
            <Form title="S'inscrire" setters={fonctions} getters={values} action={submitCheck} error={error}></Form>
        </div>
    )
}