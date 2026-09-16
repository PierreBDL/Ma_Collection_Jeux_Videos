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
    action: () => void
    error?: string
}

export default function Form ({title, setters, getters, action, error}: FormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        action()
    }

    return (
        <div>
            <h1>{title}</h1>
            <form onSubmit={handleSubmit}>
                <label>Email :</label>
                <input type="email" value={getters.email} onChange={(e) => setters.setEmail(e.target.value)} required />
                <label>Mot de passe :</label>
                <input type="password" value={getters.password} onChange={(e) => setters.setPassword(e.target.value)} required />

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button isDisable={false} handleClick={() => {}}>{title}</Button>
            </form>
        </div>
    )
}