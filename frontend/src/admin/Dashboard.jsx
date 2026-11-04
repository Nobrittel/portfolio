import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'

function Dashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    apiRequest('/api/admin/stats')
      .then((data) => {
        if (active) setStats(data)
      })
      .catch((err) => {
        if (!active) return
        if (err.status === 401) {
          logout() // session expirée : retour à la page de connexion
        } else {
          setError(true)
        }
      })

    return () => {
      active = false
    }
  }, [logout])

  const cards = stats
    ? [
        { label: 'Projets', value: stats.projects, detail: stats.published + ' publiés, ' + stats.drafts + ' brouillons' },
        { label: 'Compétences', value: stats.skills },
        { label: 'Expériences', value: stats.experiences },
        { label: 'Formations', value: stats.educations },
        { label: 'Messages', value: stats.messages, detail: stats.newMessages + ' nouveaux' },
      ]
    : []
  if (!user) return null
      

  return (
    <div>
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      <p className="mt-2 text-muted">Bonjour {user?.name}.</p>

      {error && (
        <p className="mt-8 text-red-500">
          Impossible de charger les statistiques. Vérifie que le serveur est lancé.
        </p>
      )}

      {!stats && !error && <p className="mt-8 text-muted">Chargement...</p>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-line bg-card p-6"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-4xl font-bold text-accent">{card.value}</p>
            {card.detail && (
              <p className="mt-1 text-sm text-body">{card.detail}</p>
            )}
          </div>
        ))}
      </div>
       <Link to="/admin/projects" className="mt-8 inline-block text-accent hover:underline">
        Gérer les projets </Link>
    </div>
  )
}

export default Dashboard