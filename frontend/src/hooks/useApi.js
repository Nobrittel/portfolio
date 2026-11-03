import { useEffect, useState } from 'react'
import { API_URL } from '../api'

// Charge des données depuis l'API : { data, loading, error }
export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: true, error: false })

  useEffect(() => {
    const controller = new AbortController()

    fetch(API_URL + path, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('HTTP ' + response.status)
        return response.json()
      })
      .then((data) => setState({ data, loading: false, error: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error: true })
        }
      })

    return () => controller.abort()
  }, [path])

  return state
}