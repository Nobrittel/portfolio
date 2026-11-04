import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'

const ADMIN = '/api/admin'

export default function AdminProjects() {
  const { logout } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    apiRequest(`${ADMIN}/projects`)
      .then(setProjects)
      .catch((e) => {
        if (e.status === 401) logout()
        else setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [logout])

  async function patchProject(project, changes) {
    setBusyId(project.id)
    setError('')
    try {
      const updated = await apiRequest(`${ADMIN}/projects/${project.id}`, {
        method: 'PUT',
        body: changes,
      })
      setProjects((list) => list.map((p) => (p.id === updated.id ? updated : p)))
    } catch (e) {
      if (e.status === 401) logout()
      else setError(e.message)
    } finally {
      setBusyId(null)
    }
  }

  async function removeProject(project) {
    const name = project.titleFr || project.titleEn || `#${project.id}`
    if (!window.confirm(`Supprimer définitivement « ${name} » ?`)) return
    setBusyId(project.id)
    setError('')
    try {
      await apiRequest(`${ADMIN}/projects/${project.id}`, { method: 'DELETE' })
      setProjects((list) => list.filter((p) => p.id !== project.id))
    } catch (e) {
      if (e.status === 401) logout()
      else setError(e.message)
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <p className="text-muted">Chargement…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projets</h1>
        <span className="text-sm text-muted">{projects.length} au total</span>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-line bg-card p-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {projects.length === 0 ? (
        <p className="text-muted">Aucun projet pour l'instant.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => {
            const busy = busyId === p.id
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.titleFr || p.titleEn}</p>
                  <p className="truncate text-sm text-muted">
                    {p.titleEn} · {p.slug}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-chip px-2 py-0.5 text-body">
                      {p.category?.slug || 'sans catégorie'}
                    </span>
                    <span className="rounded-full bg-chip px-2 py-0.5 text-body">
                      {p.progress === 'ongoing' ? 'En cours' : 'Terminé'}
                    </span>
                    <span
                      className={
                        'rounded-full px-2 py-0.5 ' +
                        (p.published
                          ? 'bg-green-500/15 text-green-600'
                          : 'bg-yellow-500/15 text-yellow-600')
                      }
                    >
                      {p.published ? 'Publié' : 'Brouillon'}
                    </span>
                    {p.featured && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">
                        ★ Vedette
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <button
                    disabled={busy}
                    onClick={() => patchProject(p, { published: !p.published })}
                    className="rounded-lg border border-line px-3 py-1.5 hover:bg-chip disabled:opacity-50"
                  >
                    {p.published ? 'Dépublier' : 'Publier'}
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => patchProject(p, { featured: !p.featured })}
                    className="rounded-lg border border-line px-3 py-1.5 hover:bg-chip disabled:opacity-50"
                  >
                    {p.featured ? 'Retirer vedette' : 'Mettre en vedette'}
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => removeProject(p)}
                    className="rounded-lg border border-red-500/40 px-3 py-1.5 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}