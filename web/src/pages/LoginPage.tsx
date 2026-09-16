import '../css/Login.css'
import {useState} from 'react'
import Form from '../components/Form'

export default function LoginPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const fonctions = {setEmail, setPassword}
    const values = {email, password}

    return (
        <div className="login-page">
            <Form title="Se connecter" setters={fonctions} getters={values}></Form>
        </div>
    )
}