import type { JeuxProps } from '../interfaces/gameInt'

export default function GameCard ({ nom, studio, plateforme, annee, genre }: JeuxProps) {
    return (
        <div className="card">
            <h3 className="title">{nom}</h3>

            <p className="genre">{genre}</p>
            <p className="year">{annee}</p>
            <p className="studio">Par <span>{studio}</span></p>
            
            <p className="platform">{plateforme}</p>
        </div>
    )
}