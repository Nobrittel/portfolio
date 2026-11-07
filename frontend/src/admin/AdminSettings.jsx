import { useEffect, useRef, useState } from 'react'
import { apiRequest, imageUrl, uploadDocument } from '../api'
import { useAuth } from '../context/auth'
import { btn } from './adminStyles'
import ImageUpload from './ImageUpload'

const MAX_PDF = 10 * 1024 * 1024 // 10 Mo, comme sur le serveur

export default function AdminSettings() {
  const { logout } = useAuth()
  const cvInput = useRef(null)

  const [form, setForm] = useState({ profilePhoto: '', cvPath: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [cvError, setCvError] = useState('')
  const [globalError, setGlobalError] = useState('')

  useEffect(() => {
    apiRequest('/api/admin/settings')
      .then((s) => setForm({ profilePhoto: s.profilePhoto || '', cvPath: s.cvPath || '' }))
      .catch((e) => {
        if (e.status === 401) logout()
        else setGlobalError(e.message)
      })
      .finally(() => setLoading(false))
  }, [logout])

  async function handleCv(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (file.size > MAX_PDF) {
      setCvError('Fichier trop lourd (10 Mo maximum)')
      return
    }

    setUploading(true)
    setCvError('')
    setMessage('')
    try {
      const { path } = await uploadDocument(file)
      setForm((f) => ({ ...f, cvPath: path }))
    } catch (err) {
      if (err.status === 401) logout()
      else setCvError(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    setMessage('')
    setGlobalError('')
    try {
      await apiRequest('/api/admin/settings', { method: 'PUT', body: form })
      setMessage('Réglages enregistrés.')
    } catch (err) {
      if (err.status === 401) logout()
      else if (err.status === 400 && err.data?.errors) setErrors(err.data.errors)
      else setGlobalError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted">Chargement…</p>

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold">Photo et CV</h1>

      {globalError && (
        <p className="rounded-lg border border-line bg-card p-3 text-sm text-red-500">
          {globalError}
        </p>
      )}

      <section className="space-y-3 rounded-xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Photo de profil</h2>
        <p className="text-sm text-muted">
          Affichée sur la page d'accueil. Sans photo choisie, le site garde /photo.png.
        </p>
        <ImageUpload
          value={form.profilePhoto}
          onChange={(path) => {
            setForm((f) => ({ ...f, profilePhoto: path }))
            setMessage('')
          }}
          error={errors.profilePhoto}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">CV (PDF)</h2>
        <p className="text-sm text-muted">
          Téléchargé par les visiteurs via le bouton « Télécharger mon CV ». Sans CV choisi,
          le site garde /cv.pdf.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={cvInput}
            type="file"
            accept="application/pdf"
            onChange={handleCv}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => cvInput.current?.click()}
            className={btn('edit')}
          >
            {uploading ? 'Envoi en cours…' : form.cvPath ? 'Changer le CV' : 'Choisir un PDF'}
          </button>
          {form.cvPath && (
            <>
              <a
                href={imageUrl(form.cvPath)}
                target="_blank"
                rel="noreferrer"
                className={btn('reply')}
              >
                Voir le CV
              </a>
              <button
                type="button"
                disabled={uploading}
                onClick={() => setForm((f) => ({ ...f, cvPath: '' }))}
                className={btn('unfeature')}
              >
                Retirer
              </button>
            </>
          )}
        </div>

        {form.cvPath && <p className="text-xs text-muted">Fichier : {form.cvPath}</p>}
        {cvError && <p className="text-xs text-red-500">{cvError}</p>}
        {errors.cvPath && <p className="text-xs text-red-500">{errors.cvPath}</p>}
        <p className="text-xs text-muted">PDF uniquement, 10 Mo maximum.</p>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-accent px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {message && <p className="text-sm text-green-500">{message}</p>}
      </div>
    </form>
  )
}
