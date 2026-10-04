import Button from './Button'
import upImg from '../assets/up.png'

export default function GoTop () {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button style={`w-10 h-10 bg-white p-1.5 rounded-full flex justify-center place-items-center`} handleClick={() => window.scrollTo({top: 0, left:0, behavior: "smooth"})} isDisable={false}>
                <img className={`w-6 h-6`} src={upImg} alt="Retourner en haut" />
            </Button>
        </div>
    )
}