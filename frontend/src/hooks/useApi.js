import { useEffect, useState } from 'react'
import { API_URL } from '../api'

// Durée pendant laquelle une réponse est réutilisée sans redemander au serveur
const TTL = 30 * 1000

// Nouvelles tentatives si le serveur ne répond pas (ex : Render qui se réveille)
const RETRIES = 3
const RETRY_DELAY = 3000 // 3 s, puis 6 s, puis 9 s

// adresse -> { promise, time } : les demandes en cours ou récentes
const cache = new Map()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJson(path) {
  let lastError

  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const response = await fetch(API_URL + path)
      if (response.ok) return await response.json()

      // Erreur 4xx (ex : projet introuvable) : réponse définitive, on ne réessaie pas
      if (response.status < 500) {
        const error = new Error('HTTP ' + response.status)
        error.final = true
        throw error
      }
      lastError = new Error('HTTP ' + response.status)
    } catch (error) {
      if (error.final) throw error
      lastError = error // erreur réseau ou 5xx : on réessaie
    }

    if (attempt < RETRIES) await wait(RETRY_DELAY * (attempt + 1))
  }

  throw lastError
}

function load(path) {
  const cached = cache.get(path)
  if (cached && Date.now() - cached.time < TTL) return cached.promise

  const promise = fetchJson(path)

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