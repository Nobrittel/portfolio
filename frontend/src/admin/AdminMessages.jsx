import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'
import { btn } from './adminStyles'

const ADMIN = '/api/admin/messages'

const STATUS = {
  NEW: { label: 'Nouveau', badge: 'bg-red-500/15 text-red-500' },
  READ: { label: 'Lu', badge: 'bg-chip text-body' },
  HANDLED: { label: 'Traité', badge: 'bg-green-500/15 text-green-600' },
}

const FILTERS = [
  { value: 'ALL', label: 'Tous' },
  { value: 'NEW', label: 'Nouveaux' },
  { value: 'READ', label: 'Lus' },
  { value: 'HANDLED', label: 'Traités' },
]

export default function AdminMessages() {
  const { logout } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [openId, setOpenId] = useState(null)
  const [busyId, setBusyId] = useState(null)

  function handleError(e) {
    if (e.status === 401) logout()
    else setError(e.message)
  }

  useEffect(() => {
    apiRequest(ADMIN)
      .then(setMessages)
      .catch((e) => {
        if (e.status === 401) logout()
        else setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [logout])

  async function setStatus(message, status) {
    setBusyId(message.id)
    setError('')
    try {
      const updated = await apiRequest(`${ADMIN}/${message.id}`, {
        method: 'PATCH',
        body: { status },
      })
      setMessages((list) => list.map((m) => (m.id === updated.id ? updated : m)))
    } catch (e) {
      handleError(e)
    } finally {
      setBusyId(null)
    }
  }

  // Ouvrir un message nouveau le marque automatiquement comme lu
  function toggle(message) {
    if (openId === message.id) {
      setOpenId(null)
      return
    }
    setOpenId(message.id)
    if (message.status === 'NEW') setStatus(message, 'READ')
  }

  async function removeMessage(message) {
    if (!window.confirm(`Supprimer le message de « ${message.name} » ?`)) return
    setBusyId(message.id)
    setError('')
    try {
      await apiRequest(`${ADMIN}/${message.id}`, { method: 'DELETE' })
      setMessages((list) => list.filter((m) => m.id !== message.id))
    } catch (e) {
      handleError(e)
    } finally {
      setBusyId(null)
    }
  }

  const count = (value) =>
    value === 'ALL' ? messages.length : messages.filter((m) => m.status === value).length

  const visible = filter === 'ALL' ? messages : messages.filter((m) => m.status === filter)

  if (loading) return <p className="text-muted">Chargement…</p>

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Messages reçus</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={
              'rounded-full px-4 py-1.5 text-sm font-medium ' +
              (filter === f.value
                ? 'bg-accent text-white'
                : 'border border-line text-body hover:bg-chip')
            }
          >
            {f.label} ({count(f.value)})
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-line bg-card p-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <p className="text-muted">Aucun message dans cette catégorie.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((m) => {
            const busy = busyId === m.id
            const open = openId === m.id
            const status = STATUS[m.status] || STATUS.READ
            const canReply = /^[^\s@]+@[^\s@]+$/.test(m.email)

            return (
              <li key={m.id} className="rounded-xl border border-line bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{m.subject}</p>
                    <p className="text-sm text-muted">
                      {m.name} · {m.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted">
                      {new Date(m.createdAt).toLocaleString('fr-FR')}
                    </span>
                    <span className={'rounded-full px-2 py-0.5 ' + status.badge}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <p
                  className={
                    'mt-3 whitespace-pre-wrap text-sm text-body ' + (open ? '' : 'line-clamp-2')
                  }
                >
                  {m.content}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => toggle(m)} className={btn('unfeature')}>
                    {open ? 'Réduire' : 'Lire'}
                  </button>
                  {canReply && (
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + m.subject)}`}
                      className={btn('reply')}
                    >
                      Répondre
                    </a>
                  )}
                  {m.status === 'HANDLED' ? (
                    <button
                      disabled={busy}
                      onClick={() => setStatus(m, 'READ')}
                      className={btn('unpublish')}
                    >
                      Rouvrir
                    </button>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={() => setStatus(m, 'HANDLED')}
                      className={btn('publish')}
                    >
                      Marquer traité
                    </button>
                  )}
                  <button
                    disabled={busy}
                    onClick={() => removeMessage(m)}
                    className={btn('danger')}
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