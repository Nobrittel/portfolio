import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth'

function Login() {
  const { user, loading, login } = useAuth()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Déjà connecté : on va directement au tableau de bord
  if (!loading && user) {
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(email, password)
    } catch (err) {
      if (err.status === 429) {
        setError('Trop de tentatives. Réessaie dans 15 minutes.')
      } else if (err.status === 401) {
        setError('Email ou mot de passe incorrect.')
      } else if (err.status === 400) {
        setError('Email et mot de passe requis.')
      } else {
        setError('Impossible de joindre le serveur.')
      }
      setSubmitting(false)
    }
  }

  const inputClass =
    'mt-2 w-full rounded-lg border border-line bg-page px-4 py-3 text-fg outline-none placeholder:text-muted focus:border-accent'

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6 text-fg">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8">
        <h1 className="text-2xl font-bold">
          Connexion <span className="text-accent">admin</span>
        </h1>
        <p className="mt-2 text-sm text-muted">
          Espace réservé à l'administrateur du portfolio.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm text-body">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-body">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login