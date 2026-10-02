import { type JeuxProps } from '../interfaces/gameInt'
import { UseTheme } from '../hooks/Theme'

interface partOfGraph {
    label: string;
    val: number,
    color: string
}

export default function Graph({ favoris }: { favoris: JeuxProps[] }) {
    // Hook thème
    const {theme} = UseTheme()

    // Valeurs pour le render
    const rayon: number = 15.9155
    let total: number = 0

    const colors: string[] = [
        "#3b82f6",
        "#ef4444",
        "#10b981",
        "#f59e0b",
        "#a855f7",
        "#ec4899",
        "#06b6d4",
        "#f97316",
        "#14b8a6",
        "#6366f1",
    ];

    const plateformes: string[] = [
        "Nintendo - GameBoy Advance",
        "Nintendo - Switch",
        "PC",
        "PlayStation 5",
        "PlayStation 4"

    ]

    let jeuxRepartition: partOfGraph[] = plateformes.map((plateforme, index) => {
        const nbGame: number = favoris.filter(p => p.plateforme.toLowerCase() === plateforme.toLowerCase()).length
        const percent: number = favoris.length === 0 ? 0 : (nbGame / favoris.length) * 100
        return { label: plateforme, val: percent, color: colors[index] }
    })

    return (
        <div className="flex flex-row">
            <svg viewBox="0 0 100 100" className="w-58 h-58 transform -rotate-90">
                <circle
                    cx={50}
                    cy={50}
                    strokeWidth={rayon * 2}
                    fill="transparent"
                    r={rayon}
                    stroke="white"
                ></circle>
                {
                    jeuxRepartition.map((value, i) => {
                        const strokeDashoffset = total

                        total = total + value.val

                        return (
                            <circle
                                key={i}
                                cx={50}
                                cy={50}
                                strokeWidth={rayon * 2}
                                fill="transparent"
                                r={rayon}
                                strokeDasharray={`${value.val} ${100 - value.val}`}
                                stroke={value.color}
                                strokeDashoffset={-strokeDashoffset}
                            ></circle>
                        )
                    })
                }
            </svg>

            <div className="flex flex-col gap-4 justify-center">
                {jeuxRepartition.map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm font-medium ${theme === "dark" ? "text-black" : "text-white"}`}>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.label} ({Math.round(item.val)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    )
}