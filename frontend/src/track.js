import { API_URL } from './api'

// Pour ne pas fausser les statistiques avec tes propres visites :
// ouvre une fois  http://localhost:5173/?notrack  sur ce navigateur.
// Pour réactiver le suivi : ouvre  http://localhost:5173/?track
const FLAG = 'notrack'

function disabled() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.has('notrack')) localStorage.setItem(FLAG, '1')
    if (params.has('track')) localStorage.removeItem(FLAG)
    return localStorage.getItem(FLAG) === '1'
  } catch {
    return false
  }
}

// Le suivi ne doit jamais casser le site : toute erreur est ignorée
function send(data) {
  try {
    fetch(API_URL + '/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* ignoré */
  }
}

// Une vue par onglet (pas à chaque rechargement)
export function trackView() {
  if (disabled()) return
  try {
    if (sessionStorage.getItem('viewed')) return
    sessionStorage.setItem('viewed', '1')
  } catch {
    /* ignoré */
  }
  send({ type: 'VIEW', path: window.location.pathname })
}

export function trackClick(label) {
  if (disabled()) return
  send({ type: 'CLICK', label, path: window.location.pathname })
}

// Repère tout seul les liens marqués  data-track="nom-du-lien"
// Le nom ne doit contenir que : lettres, chiffres, tirets, points (ex : whatsapp, cv, github-portfolio)
export function startClickTracking() {
  function onClick(event) {
    const element = event.target.closest?.('[data-track]')
    if (element) trackClick(element.getAttribute('data-track'))
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}