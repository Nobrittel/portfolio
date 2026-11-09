import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../context/settings'
import { useApi } from '../hooks/useApi'
import { imageUrl } from '../api'

const technologies = [
  'JavaScript',
  'React',
  'Node.js',
  'Express',
  'MySQL',
  'Prisma',
  'Git',
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function useTyping(words, speed = 80, pause = 1600) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    let delay = deleting ? speed / 2 : speed
    if (!deleting && text === word) delay = pause

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true)
      } else if (deleting && text === '') {
        setDeleting(false)
        setIndex((index + 1) % words.length)
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)))
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [text, deleting, index, words, speed, pause])

  return text
}

function Hero() {
  const { t } = useSettings()
  const typedRole = useTyping(t.hero.roles)

  // Photo choisie dans l'administration, sinon la photo par défaut
  const { data: settings } = useApi('/api/settings')
  const photo = settings?.profilePhoto ? imageUrl(settings.profilePhoto) : '/photo.webp'
  return (
    <section
      id="accueil"
      className="flex min-h-screen items-center px-6 pt-24 pb-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 md:flex-row">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-1 text-sm text-body"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
            {t.hero.available}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-bold leading-tight text-fg md:text-6xl"
          >
            {t.hero.greeting}{' '}
            <span className="text-accent">Loïc NOUDEHOUENOU</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-2 h-10 text-2xl font-semibold text-body md:text-3xl"
          >
            {typedRole}
            <span className="animate-pulse text-accent">|</span>
          </motion.p>

          <motion.p variants={item} className="mt-6 max-w-2xl text-lg text-muted">
            {t.hero.intro}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projets"
              data-track="hero-projets"
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-hover"
            >
              {t.hero.seeProjects}
            </a>
            <a
              href="#contact"
              data-track="hero-contact"
              className="rounded-lg border border-line px-6 py-3 font-semibold text-fg transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              {t.hero.contactMe}
            </a>
          </motion.div>

          <motion.ul variants={item} className="mt-12 flex flex-wrap gap-3">
            {technologies.map((tech) => (
              <motion.li
                key={tech}
                whileHover={{ y: -4 }}
                className="rounded-md bg-chip px-3 py-1 text-sm text-body"
              >
                {tech}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-brand/20 blur-2xl"></div>
            <img
              src={photo}
              alt={t.hero.photoAlt}
              width="320"
              height="320"
              fetchPriority="high"
              decoding="async"
              className="relative h-64 w-64 rounded-2xl border-4 border-line object-cover md:h-80 md:w-80"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero