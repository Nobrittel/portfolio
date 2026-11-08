import { useRef, useState } from 'react'
import { apiRequest, imageUrl, uploadImage } from '../api'
import { useAuth } from '../context/auth'
import { btn } from './adminStyles'

const MAX_IMAGES = 12
const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo, comme sur le serveur
const BASE = '/api/admin/gallery'

export default function GalleryManager({ projectId, initialImages }) {
  const { logout } = useAuth()
  const inputRef = useRef(null)
  const [images, setImages] = useState(initialImages)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = '' // permet de rechoisir les mêmes fichiers
    if (files.length === 0) return

    setMessage('')

    const room = MAX_IMAGES - images.length
    if (room <= 0) {
      setMessage('Galerie pleine (' + MAX_IMAGES + ' images maximum).')
      return
    }

    const selected = files.slice(0, room)
    const problems = []
    if (files.length > selected.length) {
      problems.push(files.length - selected.length + ' image(s) ignorée(s) : galerie pleine.')
    }

    setBusy(true)
    for (const file of selected) {
      try {
        if (file.size > MAX_SIZE) throw new Error('trop lourde (5 Mo maximum)')
        const { path } = await uploadImage(file)
        const created = await apiRequest(`${BASE}/projects/${projectId}/images`, {
          method: 'POST',
          body: { url: path },
        })
        setImages((list) => [...list, created])
      } catch (err) {
        if (err.status === 401) {
          logout()
          return
        }
        problems.push(file.name + ' : ' + err.message)
      }
    }
    setBusy(false)
    setMessage(problems.join(' '))
  }

  async function removeImage(image) {
    if (!window.confirm('Retirer cette image de la galerie ?')) return
    setBusy(true)
    setMessage('')
    try {
      await apiRequest(`${BASE}/images/${image.id}`, { method: 'DELETE' })
      setImages((list) => list.filter((i) => i.id !== image.id))
    } catch (err) {
      if (err.status === 401) logout()
      else setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Les images de la galerie sont enregistrées tout de suite, sans attendre le bouton
        « Enregistrer ». JPG, PNG ou WebP, 5 Mo maximum chacune, {MAX_IMAGES} images maximum.
      </p>

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <li key={image.id} className="space-y-2">
              <img
                src={imageUrl(image.url)}
                alt="Galerie"
                loading="lazy"
                className="h-28 w-full rounded-lg border border-line object-cover"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => removeImage(image)}
                className={btn('danger') + ' w-full'}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFiles}
          className="hidden"
        />
        <button
          type="button"
          disabled={busy || images.length >= MAX_IMAGES}
          onClick={() => inputRef.current?.click()}
          className={btn('edit')}
        >
          {busy ? 'Envoi en cours…' : 'Ajouter des images'}
        </button>
        <span className="text-sm text-muted">
          {images.length} / {MAX_IMAGES}
        </span>
      </div>

      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  )
}