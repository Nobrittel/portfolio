import { useEffect, useState } from 'react'
import { API_URL } from '../api'

// Durée pendant laquelle une réponse est réutilisée sans redemander au serveur
const TTL = 30 * 1000

// adresse -> { promise, time } : les demandes en cours ou récentes
const cache = new Map()

function load(path) {
  const cached = cache.get(path)
  if (cached && Date.now() - cached.time < TTL) return cached.promise

  const promise = fetch(API_URL + path).then((response) => {
    if (!response.ok) throw new Error('HTTP ' + response.status)
    return response.json()
  })

  cache.set(path, { promise, time: Date.now() })

  // Une erreur n'est pas gardée en mémoire : la prochaine demande réessaie
  promise.catch(() => {
    if (cache.get(path)?.promise === promise) cache.delete(path)
  })

  return promise
}

// Charge des données depuis l'API : { data, loading, error }
export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: true, error: false })

  useEffect(() => {
    let active = true

    load(path)
      .then((data) => {
        if (active) setState({ data, loading: false, error: false })
      })
      .catch(() => {
        if (active) setState({ data: null, loading: false, error: true })
      })

    return () => {
      active = false
    }
  }, [path])

  return state
}