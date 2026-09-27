import { useEffect, useState } from "react";

import { URL_API } from '../utils/Links'
import { useAuth } from '../context/Auth'
import { type JeuxProps } from '../interfaces/gameInt'
import {MeDB} from '../connection/RequestsDb'
import GraphCircle from '../components/GraphCircle'
import PrintComments from '../components/PrintsComments'

import notFavoriteImg from '../assets/etoile_vide.png'
import favoriteImg from '../assets/etoile.png'

export default function StatsPage() {
    const [favoris, setFavoris] = useState<JeuxProps[]>([])
    const [average, setAverage] = useState<number>(0)

    // Hook auth
    const { auth } = useAuth()

    // Récup favoris bdd
    useEffect(() => {
        if (!auth) {
            return
        }

        const collectionQuery = async () => {
            const response = await MeDB({url: `${URL_API}/me/collection`, methodToSend: "POST", token: auth.token})
            
            if (response.dataToResponse) {
                setFavoris(response.favorites || []);
            }
        };

        collectionQuery()
    }, [auth?.token])

    return (
        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-start gap-8 px-4 py-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-lg p-4">
                <h1 className="text-center text-2xl border-b border-slate-100">Plateforme</h1>
                <GraphCircle favoris={favoris}></GraphCircle>
                <h1 className="text-center text-2xl border-b border-slate-100">Note moyenne</h1>
                <div className="flex flex-col items-center gap-2 py-4">
                    <p className="text-l font-semibold">{average.toFixed(2)} <span className="text-l font-normal">/ 5</span></p>
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