import erreur404 from '../assets/404.png'

export default function NotFoundPage() {
  return (
    <div className="text-center w-full flex-1 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">404 - Page introuvable</h1>
      <p className="text-lg">La page n'existe pas :(</p>
      <img src={erreur404} alt="Erreur 404" />
    </div>
  )
}