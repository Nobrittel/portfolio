import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center text-fg">
      <p className="text-6xl font-bold text-accent">404</p>
      <p className="mt-4 text-muted">Cette page n'existe pas.</p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-hover"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}

export default NotFound