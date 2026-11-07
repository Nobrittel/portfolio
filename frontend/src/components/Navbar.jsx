import { useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { useSettings } from '../context/settings'

function Navbar() {
  const [open, setOpen] = useState(false)
  const { t, lang, setLang, theme, toggleTheme } = useSettings()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20 })

  const links = [
    { name: t.nav.home, href: '#accueil' },
    { name: t.nav.about, href: '#apropos' },
    { name: t.nav.skills, href: '#competences' },
    { name: t.nav.projects, href: '#projets' },
    { name: t.nav.career, href: '#experiences' },
    { name: t.nav.services, href: '#services' },
    { name: t.nav.contact, href: '#contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-line bg-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <a href="#accueil" className="text-xl font-bold text-fg">
          Loïc <span className="text-accent">NOUDEHOUENOU</span>
        </a>

        <ul className="hidden gap-6 lg:flex xl:gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-body transition hover:text-accent"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div
            role="group"
            aria-label={t.nav.language}
            className="flex rounded-full border border-line p-0.5 text-xs font-semibold"
          >
            {['fr', 'en'].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={
                  'rounded-full px-2.5 py-1 uppercase transition ' +
                  (lang === code
                    ? 'bg-brand text-white'
                    : 'text-muted hover:text-accent')
                }
              >
                {code}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            aria-label={t.nav.toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg transition hover:border-accent"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button
            onClick={() => setOpen(!open)}
            aria-label={t.nav.openMenu}
            className="text-2xl text-fg lg:hidden"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line bg-page px-6 lg:hidden"
          >
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-body hover:text-accent"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <motion.div
        style={{ scaleX }}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-accent"
      />
    </nav>
  )
}

export default Navbar