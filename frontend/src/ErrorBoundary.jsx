import { Component } from 'react'

// Textes dans les deux langues (ce composant ne peut pas utiliser les réglages du site,
// car c'est justement quand ils plantent qu'il doit fonctionner)
const texts = {
  fr: {
    title: 'Oups, quelque chose ne va pas',
    message: "Une erreur est survenue à l'affichage de cette page. Recharge la page ou reviens à l'accueil.",
    reload: 'Recharger la page',
    home: "Retour à l'accueil",
  },
  en: {
    title: 'Oops, something went wrong',
    message: 'An error occurred while displaying this page. Reload the page or go back to the home page.',
    reload: 'Reload page',
    home: 'Back to home',
  },
}

function currentLanguage() {
  try {
    const stored = localStorage.getItem('lang')
    if (stored === 'fr' || stored === 'en') return stored
  } catch {
    /* ignoré */
  }
  return navigator.language && navigator.language.startsWith('en') ? 'en' : 'fr'
}

// Une classe est obligatoire : c'est la seule façon de rattraper une erreur d'affichage en React
class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Visible dans la console du navigateur (F12) pour comprendre ce qui s'est passé
    console.error('Erreur d\'affichage :', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const text = texts[currentLanguage()]

    return (
      <div className="flex min-h-screen items-center justify-center bg-page px-6 text-fg">
        <div className="max-w-md text-center">
          <p className="text-5xl" aria-hidden="true">
            ⚠️
          </p>
          <h1 className="mt-4 text-2xl font-bold">{text.title}</h1>
          <p className="mt-3 text-muted">{text.message}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-hover"
            >
              {text.reload}
            </button>
            <a
              href="/"
              className="rounded-lg border border-line px-6 py-3 font-semibold text-fg transition hover:border-accent hover:text-accent"
            >
              {text.home}
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary