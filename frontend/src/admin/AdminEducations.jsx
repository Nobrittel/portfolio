import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'
import { btn } from './adminStyles'

const ADMIN = '/api/admin/educations'

const EMPTY = {
  diplomaFr: '',
  diplomaEn: '',
  institution: '',
  periodFr: '',
  periodEn: '',
  ongoing: false,
  sortOrder: 0,
}

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus:border-accent'

// Défini en dehors du composant, sinon les champs perdent le focus à chaque frappe
function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

export default function AdminEducations() {
  const { logout } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [saving, setSaving] = useState(false)

  function handleApiError(e) {
    if (e.status === 401) logout()
    else if (e.status === 400 && e.data?.errors) {
      setErrors(e.data.errors)
      setGlobalError('Certains champs sont invalides, corrige-les ci-dessous.')
    } else setGlobalError(e.message)
  }

  useEffect(() => {
    apiRequest(ADMIN)
      .then(setItems)
      .catch((e) => {
        if (e.status === 401) logout()
        else setGlobalError(e.message)
      })
      .finally(() => setLoading(false))
  }, [logout])

  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [name]: value }))
  }

  function startEdit(item) {
    setEditingId(item.id)
    setForm({
      diplomaFr: item.diplomaFr,
      diplomaEn: item.diplomaEn,
      institution: item.institution,
      periodFr: item.periodFr,
      periodEn: item.periodEn,
      ongoing: !!item.ongoing,
      sortOrder: item.sortOrder,
    })
    setErrors({})
    setGlobalError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY)
    setErrors({})
    setGlobalError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setGlobalError('')
    try {
      await apiRequest(editingId ? `${ADMIN}/${editingId}` : ADMIN, {
        method: editingId ? 'PUT' : 'POST',
        body: { ...form, sortOrder: Number(form.sortOrder) || 0 },
      })
      setItems(await apiRequest(ADMIN))
      cancelEdit()
    } catch (err) {
      handleApiError(err)
    } finally {
      setSaving(false)
    }
  }

  async function removeItem(item) {
    if (!window.confirm(`Supprimer la formation « ${item.diplomaFr} » ?`)) return
    setGlobalError('')
    try {
      await apiRequest(`${ADMIN}/${item.id}`, { method: 'DELETE' })
      setItems((list) => list.filter((i) => i.id !== item.id))
      if (editingId === item.id) cancelEdit()
    } catch (err) {
      handleApiError(err)
    }
  }

  if (loading) return <p className="text-muted">Chargement…</p>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Formations</h1>
        <span className="text-sm text-muted">{items.length} au total</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-line bg-card p-6"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? 'Modifier la formation' : 'Nouvelle formation'}
        </h2>

        {globalError && <p className="text-sm text-red-500">{globalError}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Diplôme (français)" error={errors.diplomaFr}>
            <input className={inputClass} value={form.diplomaFr} onChange={set('diplomaFr')} />
          </Field>
          <Field label="Diplôme (anglais)" error={errors.diplomaEn}>
            <input className={inputClass} value={form.diplomaEn} onChange={set('diplomaEn')} />
          </Field>
        </div>

        <Field label="Établissement" error={errors.institution}>
          <input className={inputClass} value={form.institution} onChange={set('institution')} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Période (français)"
            error={errors.periodFr}
            hint="Exemple : 2024 - Aujourd'hui"
          >
            <input className={inputClass} value={form.periodFr} onChange={set('periodFr')} />
          </Field>
          <Field
            label="Période (anglais)"
            error={errors.periodEn}
            hint="Exemple : 2024 - Present"
          >
            <input className={inputClass} value={form.periodEn} onChange={set('periodEn')} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Ordre d'affichage"
            error={errors.sortOrder}
            hint="Plus le nombre est petit, plus la formation apparaît en haut."
          >
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.sortOrder}
              onChange={set('sortOrder')}
            />
          </Field>
          <label className="flex items-center gap-3 self-end pb-2">
            <input type="checkbox" checked={form.ongoing} onChange={set('ongoing')} />
            Formation en cours
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-5 py-2 font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : editingId ? 'Enregistrer' : 'Ajouter'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-line px-5 py-2 hover:bg-chip"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <p className="text-muted">Aucune formation pour l'instant.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold">{item.diplomaFr}</p>
                <p className="text-sm text-muted">{item.diplomaEn}</p>
                <p className="mt-1 text-sm text-body">
                  {item.institution} · {item.periodFr}
                </p>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="rounded-full bg-chip px-2 py-0.5 text-body">
                    ordre {item.sortOrder}
                  </span>
                  {item.ongoing && (
                    <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-yellow-600">
                      En cours
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => startEdit(item)} className={btn('edit')}>
                  Modifier
                </button>
                <button onClick={() => removeItem(item)} className={btn('danger')}>
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}