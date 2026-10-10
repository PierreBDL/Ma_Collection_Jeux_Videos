import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function TestConnect() {

    // Hooks
    const { auth } = useAuth()
    const navigate = useNavigate()

    // Si pas connecté, rediriger vers la page de connexion
    return () => {
        if (!auth || !auth.token) {
            localStorage.removeItem("token")
            localStorage.removeItem("auth")
            navigate("/login", { replace: true })
        }
    }
}
