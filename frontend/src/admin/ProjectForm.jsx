import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../api'
import { useAuth } from '../context/auth'
import ImageUpload from './ImageUpload'

const ADMIN = '/api/admin'

// Les catégories existent en base (seed) : on les liste ici avec leur slug
const CATEGORIES = [
  { slug: 'frontend', label: 'Frontend' },
  { slug: 'backend', label: 'Backend' },
  { slug: 'fullstack', label: 'Full-stack' },
  { slug: 'api', label: 'API' },
  { slug: 'academic', label: 'Académique' },
]

const EMPTY = {
  slug: '',
  titleFr: '',
  titleEn: '',
  shortDescFr: '',
  shortDescEn: '',
  descriptionFr: '',
  descriptionEn: '',
  image: '',
  githubUrl: '',
  demoUrl: '',
  progress: 'done',
  featured: false,
  published: false,
  projectDate: '',
  categorySlug: '',
  technologies: '',
}

// Projet venant de l'API -> valeurs du formulaire
function toForm(p) {
  return {
    slug: p.slug || '',
    titleFr: p.titleFr || '',
    titleEn: p.titleEn || '',
    shortDescFr: p.shortDescFr || '',
    shortDescEn: p.shortDescEn || '',
    descriptionFr: p.descriptionFr || '',
    descriptionEn: p.descriptionEn || '',
    image: p.image || '',
    githubUrl: p.githubUrl || '',
    demoUrl: p.demoUrl || '',
    progress: p.progress || 'done',
    featured: !!p.featured,
    published: !!p.published,
    projectDate: p.projectDate ? p.projectDate.slice(0, 10) : '',
    categorySlug: p.category?.slug || '',
    technologies: (p.technologies || []).map((t) => t.name).join(', '),
  }
}

// Valeurs du formulaire -> données envoyées à l'API
function toPayload(f) {
  return {
    slug: f.slug,
    titleFr: f.titleFr,
    titleEn: f.titleEn,
    shortDescFr: f.shortDescFr,
    shortDescEn: f.shortDescEn,
    descriptionFr: f.descriptionFr,
    descriptionEn: f.descriptionEn,
    image: f.image,
    githubUrl: f.githubUrl,
    demoUrl: f.demoUrl,
    progress: f.progress,
    featured: f.featured,
    published: f.published,
    projectDate: f.projectDate || null,
    categorySlug: f.categorySlug || null,
    technologies: f.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  }
}

const inputClass =
  'w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg outline-none focus:border-accent'

// Défini en dehors du composant, sinon les champs perdent le focus à chaque frappe
function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-fg">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

export default function ProjectForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  // Mode modification : on charge le projet
  useEffect(() => {
    if (!isEdit) return
    apiRequest(`${ADMIN}/projects/${id}`)
      .then((p) => setForm(toForm(p)))
      .catch((e) => {
        if (e.status === 401) logout()
        else setGlobalError(e.message)
      })
      .finally(() => setLoading(false))
  }, [id, isEdit, logout])

  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setGlobalError('')
    try {
      await apiRequest(isEdit ? `${ADMIN}/projects/${id}` : `${ADMIN}/projects`, {
        method: isEdit ? 'PUT' : 'POST',
        body: toPayload(form),
      })
      navigate('/admin/projects')
    } catch (err) {
      if (err.status === 401) {
        logout()
      } else if (err.status === 400 && err.data?.errors) {
        setErrors(err.data.errors)
        setGlobalError('Certains champs sont invalides, corrige-les ci-dessous.')
      } else {
        setGlobalError(err.message)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted">Chargement…</p>

  // Erreurs sur la liste de technologies (clés "technologies", "technologies.0", ...)
  const techError = Object.entries(errors).find(([k]) => k.startsWith('technologies'))?.[1]

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Modifier le projet' : 'Nouveau projet'}
        </h1>
        <Link to="/admin/projects" className="text-sm text-muted hover:underline">
          ← Retour à la liste
        </Link>
      </div>

      {globalError && (
        <p className="rounded-lg border border-line bg-card p-3 text-sm text-red-500">
          {globalError}
        </p>
      )}

      <section className="space-y-4 rounded-xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Identité</h2>
        <Field
          label="Slug (adresse du projet)"
          error={errors.slug}
          hint="Minuscules, chiffres et tirets. Exemple : mon-super-projet"
        >
          <input className={inputClass} value={form.slug} onChange={set('slug')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titre (français)" error={errors.titleFr}>
            <input className={inputClass} value={form.titleFr} onChange={set('titleFr')} />
          </Field>
          <Field label="Titre (anglais)" error={errors.titleEn}>
            <input className={inputClass} value={form.titleEn} onChange={set('titleEn')} />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Descriptions</h2>
        <Field label="Description courte (français)" error={errors.shortDescFr} hint="500 caractères maximum">
          <textarea rows={2} className={inputClass} value={form.shortDescFr} onChange={set('shortDescFr')} />
        </Field>
        <Field label="Description courte (anglais)" error={errors.shortDescEn} hint="500 caractères maximum">
          <textarea rows={2} className={inputClass} value={form.shortDescEn} onChange={set('shortDescEn')} />
        </Field>
        <Field label="Description complète (français)" error={errors.descriptionFr}>
          <textarea rows={6} className={inputClass} value={form.descriptionFr} onChange={set('descriptionFr')} />
        </Field>
        <Field label="Description complète (anglais)" error={errors.descriptionEn}>
          <textarea rows={6} className={inputClass} value={form.descriptionEn} onChange={set('descriptionEn')} />
        </Field>
      </section>

      <section className="space-y-4 rounded-xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Détails</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Catégorie" error={errors.categorySlug}>
            <select className={inputClass} value={form.categorySlug} onChange={set('categorySlug')}>
              <option value="">— Aucune —</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Avancement" error={errors.progress}>
            <select className={inputClass} value={form.progress} onChange={set('progress')}>
              <option value="done">Terminé</option>
              <option value="ongoing">En cours</option>
            </select>
          </Field>
        </div>
        <Field
          label="Technologies"
          error={techError}
          hint="Séparées par des virgules. Exemple : React, Node.js, MySQL"
        >
          <input className={inputClass} value={form.technologies} onChange={set('technologies')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Lien GitHub" error={errors.githubUrl}>
            <input className={inputClass} placeholder="https://github.com/..." value={form.githubUrl} onChange={set('githubUrl')} />
          </Field>
          <Field label="Lien démo" error={errors.demoUrl}>
            <input className={inputClass} placeholder="https://..." value={form.demoUrl} onChange={set('demoUrl')} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="mb-1 block text-sm font-medium text-fg">Image</span>
            <ImageUpload
              value={form.image}
              onChange={(path) => setForm((f) => ({ ...f, image: path }))}
              error={errors.image}
            />
          </div>
          <Field label="Date du projet" error={errors.projectDate}>
            <input type="date" className={inputClass} value={form.projectDate} onChange={set('projectDate')} />
          </Field>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Visibilité</h2>
        <label className="flex items-center gap-3 text-fg">
          <input type="checkbox" checked={form.published} onChange={set('published')} />
          Publié (visible sur le site public)
        </label>
        <label className="flex items-center gap-3 text-fg">
          <input type="checkbox" checked={form.featured} onChange={set('featured')} />
          Mis en vedette
        </label>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : 'Créer le projet'}
        </button>
        <Link to="/admin/projects" className="rounded-lg border border-line px-5 py-2 hover:bg-chip">
          Annuler
        </Link>
      </div>
    </form>
  )
}