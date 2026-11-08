import { useEffect } from 'react'

const LOCALES = { fr: 'fr_FR', en: 'en_US' }

// Crée (ou met à jour) une balise <meta> dans l'en-tête de la page
function setMeta(attribute, key, content) {
  let element = document.head.querySelector('meta[' + attribute + '="' + key + '"]')
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

// Raccourcit un texte pour une description (160 caractères environ)
export function truncate(text, max = 160) {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + '…' : clean
}

// À appeler dans une page : met à jour le titre, la description,
// l'adresse canonique et les balises de partage tant que la page est affichée.
export function useSeo({ title, description, image, type = 'website', lang, jsonLd } = {}) {
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    // Tant que le titre n'est pas connu (chargement), on ne touche à rien
    if (!title) return

    const origin = window.location.origin
    const url = origin + window.location.pathname

    const previousTitle = document.title
    const descriptionTag = document.head.querySelector('meta[name="description"]')
    const previousDescription = descriptionTag ? descriptionTag.getAttribute('content') : null

    document.title = title
    if (lang) document.documentElement.lang = lang

    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
    }
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url)
    if (lang && LOCALES[lang]) setMeta('property', 'og:locale', LOCALES[lang])
    if (image) {
      setMeta('property', 'og:image', image.startsWith('http') ? image : origin + image)
    }
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    setCanonical(url)

    // Informations structurées (schema.org), lues par Google
    let script = null
    if (jsonLdText) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = jsonLdText
      document.head.appendChild(script)
    }

    return () => {
      document.title = previousTitle
      if (previousDescription !== null) setMeta('name', 'description', previousDescription)
      document.head.querySelector('meta[property="og:image"]')?.remove()
      if (script) script.remove()
    }
  }, [title, description, image, type, lang, jsonLdText])
}