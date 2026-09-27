import { useEffect, useState } from "react";

import { URL_API } from '../utils/Links'
import { useAuth } from '../context/Auth'
import { type JeuxProps } from '../interfaces/gameInt'
import {MeDB} from '../connection/RequestsDb'
import GraphCircle from '../components/GraphCircle'
import PrintComments from '../components/PrintsComments'

export default function StatsPage() {
    const [favoris, setFavoris] = useState<JeuxProps[]>([])

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
                <GraphCircle favoris={favoris}></GraphCircle>
            </div>
            <section className="min-w-0">
                <PrintComments />
            </section>
        </div>
    )
}