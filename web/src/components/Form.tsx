import Button from './Button'

interface FormProps {
    title: string
    setters: {
        setEmail: (value: string) => void
        setPassword: (value: string) => void
    }
    getters: {
        email: string
        password: string
    }
}

export default function Form ({title, setters, getters}: FormProps) {
    return (
        <div>
            <h1>{title}</h1>
            <form>
                <label>Email :</label>
                <input type="email" value={getters.email} onChange={(e) => setters.setEmail(e.target.value)} required />
                <label>Mot de passe :</label>
                <input type="password" value={getters.password} onChange={(e) => setters.setPassword(e.target.value)} required />

                <Button isDisable={false} handleClick={() => console.log("")}>{title}</Button>
            </form>
        </div>
    )
}