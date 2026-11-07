import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'

function Dashboard() {
  const { logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState(null)
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

    // Les vues sont facultatives : une erreur ici ne bloque pas le reste
    apiRequest('/api/admin/events/summary')
      .then((data) => {
        if (active) setEvents(data)
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [logout])

  const cards = stats
    ? [
        {
          label: 'Projets',
          value: stats.projects,
          detail: stats.published + ' publiés, ' + stats.drafts + ' brouillons',
          to: '/admin/projects',
        },
        { label: 'Compétences', value: stats.skills, to: '/admin/skills' },
        { label: 'Expériences', value: stats.experiences },
        { label: 'Formations', value: stats.educations, to: '/admin/educations' },
        {
          label: 'Messages',
          value: stats.messages,
          detail: stats.newMessages + ' nouveaux',
          to: '/admin/messages',
        },
        {
          label: 'Vues',
          value: events ? events.views : '—',
          detail: events ? events.views30 + ' sur les 30 derniers jours' : 'Chargement…',
          to: '/admin/links',
        },
      ]
    : []

  return (
    <div>
      <h1 className="text-3xl font-bold">Statistiques</h1>

      {error && (
        <p className="mt-8 text-red-500">
          Impossible de charger les statistiques. Vérifie que le serveur est lancé.
        </p>
      )}

      {!stats && !error && <p className="mt-8 text-muted">Chargement...</p>}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const content = (
            <>
              <p className="text-sm text-muted">{card.label}</p>
              <p className="mt-2 text-4xl font-bold text-accent">{card.value}</p>
              {card.detail && <p className="mt-1 text-sm text-body">{card.detail}</p>}
            </>
          )
          const base = 'rounded-xl border border-line bg-card p-6'
          return card.to ? (
            <Link key={card.label} to={card.to} className={base + ' hover:border-accent'}>
              {content}
            </Link>
          ) : (
            <div key={card.label} className={base}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard