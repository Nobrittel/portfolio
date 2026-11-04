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