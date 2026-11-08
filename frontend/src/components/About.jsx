import { useEffect, useRef } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { useSettings } from '../context/settings'
import { useApi } from '../hooks/useApi'

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const textItem = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return

    const controls = animate(0, to, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (value) => {
        if (ref.current) {
          ref.current.textContent = Math.round(value) + suffix
        }
      },
    })

    return () => controls.stop()
  }, [inView, to, suffix])

  return <span ref={ref}>0{suffix}</span>
}

// Compte les éléments, que l'API renvoie une liste ou des groupes de listes
function countItems(data) {
  if (Array.isArray(data)) return data.length
  if (data && typeof data === 'object') {
    return Object.values(data).reduce(
      (total, group) => total + (Array.isArray(group) ? group.length : 0),
      0
    )
  }
  return 0
}

function About() {
  const { t } = useSettings()

  // Les compteurs lisent la base : un projet publié de plus, et le chiffre monte tout seul
  const projects = useApi('/api/projects')
  const skills = useApi('/api/skills')

  // Renvoie la valeur à afficher, ou null pendant le chargement
  function countFor(stat) {
    const source =
      stat.key === 'projects' ? projects : stat.key === 'skills' ? skills : null

    // Pas de source (ex : années d'expérience) : valeur écrite dans translations.js
    if (!source) return { value: stat.to, suffix: stat.suffix }

    if (source.data) return { value: countItems(source.data), suffix: '' }

    // Serveur injoignable : on affiche la valeur de secours de translations.js
    if (source.error) return { value: stat.to, suffix: stat.suffix }

    return null
  }

  return (
    <section id="apropos" className="scroll-mt-20 bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-fg md:text-4xl">
          {t.about.title}
        </h2>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <motion.div
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="space-y-4 text-lg text-body"
          >
            <motion.p variants={textItem}>{t.about.p1}</motion.p>
            <motion.p variants={textItem}>{t.about.p2}</motion.p>
          </motion.div>

          {/* Chaque carte s'anime toute seule, sans dépendre du bloc parent */}
          <ul className="grid grid-cols-3 gap-2 self-start sm:gap-4">
            {t.about.stats.map((stat, index) => {
              const count = countFor(stat)
              return (
                <motion.li
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.7, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.15,
                  }}
                  whileHover={{ y: -6 }}
                  className="min-w-0 rounded-xl border border-line bg-card p-3 text-center transition-colors hover:border-accent sm:p-4"
                >
                  <p className="text-2xl font-bold text-accent sm:text-3xl">
                    {count ? <CountUp to={count.value} suffix={count.suffix} /> : <span>0</span>}
                  </p>
                  <p className="mt-1 break-words text-xs text-muted sm:text-sm">{stat.label}</p>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About