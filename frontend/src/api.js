// Adresse du backend. En production, elle viendra d'une variable d'environnement.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Requête vers l'API avec le cookie de connexion.
// Renvoie les données JSON, ou lance une erreur avec .status et .data
export async function apiRequest(path, { method = 'GET', body } = {}) {
  const response = await fetch(API_URL + path, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error((data && data.error) || 'HTTP ' + response.status)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

// Envoie une image à l'administration. Renvoie { path: '/uploads/xxxx.jpg' }
export async function uploadImage(file) {
  const body = new FormData()
  body.append('file', file)

  // Pas d'en-tête Content-Type ici : le navigateur le fixe lui-même pour un fichier
  const response = await fetch(API_URL + '/api/admin/uploads', {
    method: 'POST',
    credentials: 'include',
    body,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error((data && data.error) || 'HTTP ' + response.status)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

// Adresse complète d'une image : celles envoyées via l'administration (/uploads/...)
// sont servies par le backend, les autres (ex : /photo.png) par le frontend.
export function imageUrl(path) {
  if (!path) return ''
  if (path.startsWith('/uploads/')) return API_URL + path
  if (path.includes('res.cloudinary.com') && path.includes('/image/upload/') && !path.includes('/f_auto')) {
    return path.replace('/image/upload/', '/image/upload/f_auto,q_auto/')
  }
  return path
}


// Envoie un PDF (CV) à l'administration. Renvoie { path: '/uploads/xxxx.pdf' }
export async function uploadDocument(file) {
  const body = new FormData()
  body.append('file', file)

  const response = await fetch(API_URL + '/api/admin/uploads/document', {
    method: 'POST',
    credentials: 'include',
    body,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error((data && data.error) || 'HTTP ' + response.status)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}