import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'
import { btn } from './adminStyles'

const ADMIN = '/api/admin/services'

const EMPTY = {
  titleFr: '',
  titleEn: '',
  descriptionFr: '',
  descriptionEn: '',
  icon: '',
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

export default function AdminServices() {
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

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  function startEdit(item) {
    setEditingId(item.id)
    setForm({
      titleFr: item.titleFr,
      titleEn: item.titleEn,
      descriptionFr: item.descriptionFr,
      descriptionEn: item.descriptionEn,
      icon: item.icon || '',
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
    if (!window.confirm(`Supprimer le service « ${item.titleFr} » ?`)) return
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
        <h1 className="text-3xl font-bold">Services</h1>
        <span className="text-sm text-muted">{items.length} au total</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-line bg-card p-6"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? 'Modifier le service' : 'Nouveau service'}
        </h2>

        {globalError && <p className="text-sm text-red-500">{globalError}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titre (français)" error={errors.titleFr}>
            <input className={inputClass} value={form.titleFr} onChange={set('titleFr')} />
          </Field>
          <Field label="Titre (anglais)" error={errors.titleEn}>
            <input className={inputClass} value={form.titleEn} onChange={set('titleEn')} />
          </Field>
          <Field
            label="Description (français)"
            error={errors.descriptionFr}
            hint="2000 caractères maximum"
          >
            <textarea
              rows={4}
              className={inputClass}
              value={form.descriptionFr}
              onChange={set('descriptionFr')}
            />
          </Field>
          <Field
            label="Description (anglais)"
            error={errors.descriptionEn}
            hint="2000 caractères maximum"
          >
            <textarea
              rows={4}
              className={inputClass}
              value={form.descriptionEn}
              onChange={set('descriptionEn')}
            />
          </Field>
          <Field label="Icône (optionnel)" error={errors.icon} hint="Un emoji ou un nom d'icône">
            <input className={inputClass} value={form.icon} onChange={set('icon')} />
          </Field>
          <Field
            label="Ordre d'affichage"
            error={errors.sortOrder}
            hint="Plus le nombre est petit, plus le service apparaît en haut."
          >
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.sortOrder}
              onChange={set('sortOrder')}
            />
          </Field>
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
        <p className="text-muted">Aucun service pour l'instant.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold">
                  {item.icon ? item.icon + ' ' : ''}
                  {item.titleFr}
                </p>
                <p className="text-sm text-muted">{item.titleEn}</p>
                <p className="mt-1 line-clamp-2 text-sm text-body">{item.descriptionFr}</p>
                <span className="mt-2 inline-block rounded-full bg-chip px-2 py-0.5 text-xs text-body">
                  ordre {item.sortOrder}
                </span>
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