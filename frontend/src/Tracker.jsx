import { useEffect } from 'react'
import { startClickTracking, trackView } from './track'

// Composant invisible : compte les vues et les clics du site public
function Tracker() {
  useEffect(() => {
    trackView()
    return startClickTracking()
  }, [])

  return null
}

export default Tracker