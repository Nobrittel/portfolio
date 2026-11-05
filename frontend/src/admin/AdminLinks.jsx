import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'

export default function AdminLinks() {
  const { logout } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    apiRequest('/api/admin/events/summary')
      .then((d) => {
        if (active) setData(d)
      })
      .catch((e) => {
        if (!active) return
        if (e.status === 401) logout()
        else setError(e.message)
      })
    return () => {
      active = false
    }
  }, [logout])

  if (error) return <p className="text-red-500">{error}</p>
  if (!data) return <p className="text-muted">Chargement…</p>

  const max = data.links[0]?.count || 1
  const cards = [
    { label: 'Vues (total)', value: data.views },
    { label: 'Vues (30 jours)', value: data.views30 },
    { label: 'Clics (total)', value: data.clicks },
    { label: 'Clics (30 jours)', value: data.clicks30 },
  ]

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Vues et clics sur les liens</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-line bg-card p-6">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 text-4xl font-bold text-accent">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold">Clics par lien</h2>

      {data.links.length === 0 ? (
        <p className="text-muted">Aucun clic enregistré pour l'instant.</p>
      ) : (
        <ul className="space-y-3">
          {data.links.map((l) => (
            <li key={l.label} className="rounded-xl border border-line bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{l.label}</span>
                <span className="font-bold text-accent">{l.count}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-chip">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{ width: (l.count / max) * 100 + '%' }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}