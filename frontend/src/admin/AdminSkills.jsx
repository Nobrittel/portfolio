import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'

const ADMIN = '/api/admin/skills'

const GROUPS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Base de données' },
  { value: 'tools', label: 'Outils' },
  { value: 'methods', label: 'Méthodes' },
]

const EMPTY = { name: '', group: 'frontend', icon: '', sortOrder: 0 }

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus:border-accent'

export default function AdminSkills() {
  const { logout } = useAuth()
  const [skills, setSkills] = useState([])
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
      setGlobalError('Certains champs sont invalides.')
    } else setGlobalError(e.message)
  }

  useEffect(() => {
    apiRequest(ADMIN)
      .then(setSkills)
      .catch((e) => {
        if (e.status === 401) logout()
        else setGlobalError(e.message)
      })
      .finally(() => setLoading(false))
  }, [logout])

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  function startEdit(skill) {
    setEditingId(skill.id)
    setForm({
      name: skill.name,
      group: skill.group,
      icon: skill.icon || '',
      sortOrder: skill.sortOrder,
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
          name: form.name,
          group: form.group,
          icon: form.icon,
          sortOrder: Number(form.sortOrder) || 0,
        },
      })
      setSkills(await apiRequest(ADMIN))
      cancelEdit()
    } catch (err) {
      handleApiError(err)
    } finally {
      setSaving(false)
    }
  }

  async function removeSkill(skill) {
    if (!window.confirm(`Supprimer la compétence « ${skill.name} » ?`)) return
    setGlobalError('')
    try {
      await apiRequest(`${ADMIN}/${skill.id}`, { method: 'DELETE' })
      setSkills((list) => list.filter((s) => s.id !== skill.id))
      if (editingId === skill.id) cancelEdit()
    } catch (err) {
      handleApiError(err)
    }
  }

  if (loading) return <p className="text-muted">Chargement…</p>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compétences</h1>
        <span className="text-sm text-muted">{skills.length} au total</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-line bg-card p-6"
      >
        <h2 className="text-lg font-semibold">
          {editingId ? 'Modifier la compétence' : 'Nouvelle compétence'}
        </h2>

        {globalError && <p className="text-sm text-red-500">{globalError}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Nom</span>
            <input className={inputClass} value={form.name} onChange={set('name')} />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Groupe</span>
            <select className={inputClass} value={form.group} onChange={set('group')}>
              {GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            {errors.group && <span className="text-xs text-red-500">{errors.group}</span>}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Icône (optionnel)</span>
            <input className={inputClass} value={form.icon} onChange={set('icon')} />
            {errors.icon && <span className="text-xs text-red-500">{errors.icon}</span>}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Ordre d'affichage</span>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.sortOrder}
              onChange={set('sortOrder')}
            />
            {errors.sortOrder && (
              <span className="text-xs text-red-500">{errors.sortOrder}</span>
            )}
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

      {GROUPS.map((group) => {
        const items = skills.filter((s) => s.group === group.value)
        if (items.length === 0) return null
        return (
          <section key={group.value}>
            <h2 className="mb-3 text-lg font-semibold">{group.label}</h2>
            <ul className="space-y-2">
              {items.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <span className="font-medium">{s.name}</span>
                    <span className="ml-3 text-xs text-muted">ordre {s.sortOrder}</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <button
                      onClick={() => startEdit(s)}
                      className="rounded-lg border border-line px-3 py-1.5 hover:bg-chip"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => removeSkill(s)}
                      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-red-500 hover:bg-red-500/10"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}