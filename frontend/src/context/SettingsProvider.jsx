import { useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './settings'
import { translations } from '../i18n/translations'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // stockage indisponible : on garde la valeur par défaut
  }
  return 'dark'
}

function getInitialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'fr' || saved === 'en') return saved
  } catch {
    // stockage indisponible : on garde la valeur par défaut
  }
  const browserLang = navigator.language || 'fr'
  return browserLang.startsWith('en') ? 'en' : 'fr'
}

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // ignoré
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translations[lang].meta.title
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // ignoré
    }
  }, [lang])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      lang,
      setLang,
      t: translations[lang],
    }),
    [theme, lang]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}