export interface JeuxProps {
    id: number
    nom: string
    studio: string
    plateforme: string
    annee: string
    genre: string
    description: string
    image: string
    opinion?: string
    grade?: number
    state?: "a_decouvrir" | "en_cours" | "termine"
    etat?: "a_decouvrir" | "en_cours" | "termine"
    date?: string
}
