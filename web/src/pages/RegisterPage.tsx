import '../css/Register.css'
import {useState} from 'react'
import Form from '../components/Form'

export default function RegisterPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const fonctions = {setEmail, setPassword}
    const values = {email, password}

    return (
        <div className="register-page">
            <Form title="S'inscrire" setters={fonctions} getters={values}></Form>
        </div>
    )
}