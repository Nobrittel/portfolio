import { useRef, useState } from 'react'
import { imageUrl, uploadImage } from '../api'
import { useAuth } from '../context/auth'
import { btn } from './adminStyles'

const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo, comme sur le serveur

export default function ImageUpload({ value, onChange, error }) {
  const { logout } = useAuth()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // permet de choisir deux fois le même fichier
    if (!file) return

    if (file.size > MAX_SIZE) {
      setMessage('Image trop lourde (5 Mo maximum)')
      return
    }

    setUploading(true)
    setMessage('')
    try {
      const { path } = await uploadImage(file)
      onChange(path)
    } catch (err) {
      if (err.status === 401) logout()
      else setMessage(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <img
          src={imageUrl(value)}
          alt="Aperçu"
          className="h-36 w-full max-w-xs rounded-lg border border-line object-cover"
        />
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={btn('edit')}
        >
          {uploading ? 'Envoi en cours…' : value ? 'Changer l\'image' : 'Choisir une image'}
        </button>
        {value && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => onChange('')}
            className={btn('unfeature')}
          >
            Retirer
          </button>
        )}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ou colle un chemin (/photo.png) ou une adresse https://..."
        className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-accent"
      />

      {message && <p className="text-xs text-red-500">{message}</p>}
      {error && !message && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-muted">JPG, PNG ou WebP, 5 Mo maximum.</p>
    </div>
  )
}