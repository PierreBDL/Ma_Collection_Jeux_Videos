import { UseTheme } from '../hooks/Theme'

interface partOfGraph {
    label: string;
    val: number,
    color: string
}

interface GraphProps {
    data: Record<string, number>
    dataType: string
    totalGames: number
}

export default function Graph({ data, dataType, totalGames }: GraphProps) {
    // Hook thème
    const { theme } = UseTheme()

    // Valeurs pour le render
    const rayon: number = 15.9155
    let total: number = 0

    // Couleurs
    const colors = [
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

    let keys = Object.keys(data)

    let repartition: partOfGraph[] = []

    if (dataType === "statut") {
        for (let i = 0; i < keys.length; i++) {
            repartition.push(
                {
                    label: keys[i] === "a_decouvrir" ? "A Découvrir" : (keys[i] === "en_cours" ? "En cours" : "Terminé"),
                    val: (Number(data[keys[i]]) / totalGames) * 100,
                    color: keys[i] === "a_decouvrir" ? "#2563eb" : (keys[i] === "en_cours" ? "#ea580c" : "#16a34a")
                }
            )
        }
    } else {
        for (let i = 0; i < keys.length; i++) {
            repartition.push(
                {
                    label: keys[i],
                    val: (Number(data[keys[i]]) / totalGames) * 100,
                    color: colors[i]
                }
            )
        }
    }

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
                    repartition.map((value, i) => {
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
                {repartition.map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm font-medium ${theme === "dark" ? "text-black" : "text-white"}`}>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.label} ({Math.round(item.val)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    )
}