import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'
import { btn } from './adminStyles'

const ADMIN = '/api/admin/experiences'

const EMPTY = {
  positionFr: '',
  positionEn: '',
  company: '',
  location: '',
  periodFr: '',
  periodEn: '',
  missionsFr: '',
  missionsEn: '',
  tagsFr: '',
  tagsEn: '',
  sortOrder: 0,
}

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus:border-accent'

// Liste de l'API -> texte du formulaire
const listToLines = (list) => (Array.isArray(list) ? list.join('\n') : '')
const listToCsv = (list) => (Array.isArray(list) ? list.join(', ') : '')

// Texte du formulaire -> liste envoyée à l'API
const linesToList = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
const csvToList = (text) =>
  text
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

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

export default function AdminExperiences() {
  const { logout } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [saving, setSaving] = useState(false)

  // Erreurs sur une liste : clés "missionsFr", "missionsFr.0", "missionsFr.1", ...
  const listError = (name) =>
    Object.entries(errors).find(([key]) => key === name || key.startsWith(name + '.'))?.[1]

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
      positionFr: item.positionFr,
      positionEn: item.positionEn,
      company: item.company,
      location: item.location || '',
      periodFr: item.periodFr,
      periodEn: item.periodEn,
      missionsFr: listToLines(item.missionsFr),
      missionsEn: listToLines(item.missionsEn),
      tagsFr: listToCsv(item.tagsFr),
      tagsEn: listToCsv(item.tagsEn),
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
        body: {
          positionFr: form.positionFr,
          positionEn: form.positionEn,
          company: form.company,
          location: form.location,
          periodFr: form.periodFr,
          periodEn: form.periodEn,
          missionsFr: linesToList(form.missionsFr),
          missionsEn: linesToList(form.missionsEn),
          tagsFr: csvToList(form.tagsFr),
          tagsEn: csvToList(form.tagsEn),
          sortOrder: Number(form.sortOrder) || 0,
        },
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
    if (!window.confirm(`Supprimer l'expérience « ${item.positionFr} » ?`)) return
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
        <h1 className="text-3xl font-bold">Expériences</h1>
        <span className="text-sm text-muted">{items.length} au total</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-line bg-card p-6"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? "Modifier l'expérience" : 'Nouvelle expérience'}
        </h2>

        {globalError && <p className="text-sm text-red-500">{globalError}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Poste (français)" error={errors.positionFr}>
            <input className={inputClass} value={form.positionFr} onChange={set('positionFr')} />
          </Field>
          <Field label="Poste (anglais)" error={errors.positionEn}>
            <input className={inputClass} value={form.positionEn} onChange={set('positionEn')} />
          </Field>
          <Field label="Entreprise" error={errors.company}>
            <input className={inputClass} value={form.company} onChange={set('company')} />
          </Field>
          <Field label="Lieu (optionnel)" error={errors.location}>
            <input className={inputClass} value={form.location} onChange={set('location')} />
          </Field>
          <Field
            label="Période (français)"
            error={errors.periodFr}
            hint="Exemple : Janvier 2024 - Juin 2024"
          >
            <input className={inputClass} value={form.periodFr} onChange={set('periodFr')} />
          </Field>
          <Field
            label="Période (anglais)"
            error={errors.periodEn}
            hint="Exemple : January 2024 - June 2024"
          >
            <input className={inputClass} value={form.periodEn} onChange={set('periodEn')} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Missions (français)"
            error={listError('missionsFr')}
            hint="Une mission par ligne (20 maximum)"
          >
            <textarea
              rows={6}
              className={inputClass}
              value={form.missionsFr}
              onChange={set('missionsFr')}
            />
          </Field>
          <Field
            label="Missions (anglais)"
            error={listError('missionsEn')}
            hint="Une mission par ligne (20 maximum)"
          >
            <textarea
              rows={6}
              className={inputClass}
              value={form.missionsEn}
              onChange={set('missionsEn')}
            />
          </Field>
          <Field
            label="Mots-clés (français)"
            error={listError('tagsFr')}
            hint="Séparés par des virgules. Exemple : PHP, MySQL, Formation"
          >
            <input className={inputClass} value={form.tagsFr} onChange={set('tagsFr')} />
          </Field>
          <Field
            label="Mots-clés (anglais)"
            error={listError('tagsEn')}
            hint="Séparés par des virgules. Exemple : PHP, MySQL, Training"
          >
            <input className={inputClass} value={form.tagsEn} onChange={set('tagsEn')} />
          </Field>
        </div>

        <div className="max-w-xs">
          <Field
            label="Ordre d'affichage"
            error={errors.sortOrder}
            hint="Plus le nombre est petit, plus l'expérience apparaît en haut."
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
        <p className="text-muted">Aucune expérience pour l'instant.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold">{item.positionFr}</p>
                <p className="text-sm text-muted">{item.positionEn}</p>
                <p className="mt-1 text-sm text-body">
                  {item.company}
                  {item.location ? ' · ' + item.location : ''} · {item.periodFr}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-chip px-2 py-0.5 text-body">
                    ordre {item.sortOrder}
                  </span>
                  <span className="rounded-full bg-chip px-2 py-0.5 text-body">
                    {Array.isArray(item.missionsFr) ? item.missionsFr.length : 0} mission(s)
                  </span>
                  {(Array.isArray(item.tagsFr) ? item.tagsFr : []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent/15 px-2 py-0.5 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
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