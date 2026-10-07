import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { URL_API } from '../utils/Links'
import { useAuth } from '../hooks/Auth'
import { type JeuxProps } from '../interfaces/gameInt'
import {MeDB} from '../hooks/RequestsDb'
import GraphCircle from '../components/GraphCircle'
import PrintComments from '../components/PrintsComments'
import {UseTheme} from '../hooks/Theme'
import Button from '../components/Button'

import notFavoriteImg from '../assets/etoile_vide.png'
import favoriteImg from '../assets/etoile.png'
import NotFoundImg from '../assets/404.png'

export default function StatsPage() {
    const [favoris, setFavoris] = useState<JeuxProps[]>([])
    const [average, setAverage] = useState<number>(0)

    // Hook auth
    const { auth } = useAuth()

    // Hook Theme
    const {theme} = UseTheme()

    // Navigate
    const navigate = useNavigate()

    // Récup favoris bdd
    useEffect(() => {
        if (!auth) {
            return
        }

        const collectionQuery = async () => {
            const response = await MeDB({url: `${URL_API}/me/collection`, methodToSend: "GET", token: auth.token})
            
            if (response.dataToResponse) {
                setFavoris(response.favorites || []);
            }
        };

        collectionQuery()
    }, [auth?.token])

    // Si pas de jeux
    if (auth && auth?.favorites.length <= 0) {
        return (
            <div className="text-center w-full flex-1 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Vous n'avez pas de jeu favoris</h1>
                <img src={NotFoundImg} alt="Erreur" />
                <Button style="rounded-lg mt-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer" isDisable={false} handleClick={() => navigate("/")}>Revenir à l'accueil</Button>
            </div>
        )
    }

    return (
        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-start gap-8 px-4 py-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-lg p-4">
                <h1 className={`text-center text-2xl border-b ${theme === "light" ? "border-white text-white" : "text-black border-black"}`}>Plateforme</h1>
                <GraphCircle favoris={favoris}></GraphCircle>
                <h1 className={`text-center text-2xl border-b ${theme === "light" ? "border-white text-white" : "border-black text-black"}`}>Note moyenne</h1>
                <div className="flex flex-col items-center gap-2 py-4">
                    <p className={`text-l font-semibold ${theme === "light" ? "border-slate-800 text-white" : "text-black border-slate-600"}`}>{average.toFixed(2)} <span className="text-l font-normal">/ 5</span></p>
                    <div className="flex flex-row gap-4">
                    {
                        [1, 2, 3, 4, 5].map(star => (
                            <img key={star} className="w-7 h-7" src={star <= Math.round(average) ? favoriteImg : notFavoriteImg} alt="Note moyenne" />
                        ))
                    }
                    </div>
                </div>
            </div>
            <section className="min-w-0">
                <PrintComments setMoyenne={setAverage} />
            </section>
        </div>
    )
}