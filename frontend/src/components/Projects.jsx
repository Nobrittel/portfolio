import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettings } from '../context/settings'

const categoryKeys = ['all', 'frontend', 'backend', 'fullstack', 'api', 'academic']

// À MODIFIER : technologies, catégories, statuts et liens
// Les titres et descriptions sont dans src/i18n/translations.js
const projects = [
  {
    id: 'timeteach',
    category: 'fullstack',
    technologies: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
    status: 'done',
    github: '#',
    demo: '#',
  },
  {
    id: 'api',
    category: 'api',
    technologies: ['Node.js', 'Express', 'MySQL'],
    status: 'done',
    github: '#',
    demo: '#',
  },
  {
    id: 'showcase',
    category: 'frontend',
    technologies: ['React', 'Tailwind CSS'],
    status: 'done',
    github: '#',
    demo: '#',
  },
  {
    id: 'gym',
    category: 'fullstack',
    technologies: ['PHP', 'MySQL', 'Bootstrap'],
    status: 'done',
    github: '#',
    demo: '#',
  },
  {
    id: 'coop',
    category: 'fullstack',
    technologies: ['PHP', 'MySQL', 'Bootstrap'],
    status: 'done',
    github: '#',
    demo: '#',
  },
  {
    id: 'appointments',
    category: 'fullstack',
    technologies: ['PHP', 'MySQL', 'JavaScript'],
    status: 'done',
    github: '#',
    demo: '#',
  },
]

function Projects() {
  const { t } = useSettings()
  const p = t.projects
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filteredProjects = projects.filter((project) => {
    const info = p.items[project.id]
    const matchCategory =
      activeCategory === 'all' || project.category === activeCategory

    const text = (
      info.title +
      ' ' +
      info.description +
      ' ' +
      p.categories[project.category] +
      ' ' +
      project.technologies.join(' ')
    ).toLowerCase()

    const matchSearch = text.includes(search.toLowerCase())

    return matchCategory && matchSearch
  })

  return (
    <section id="projets" className="scroll-mt-20 bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-fg md:text-4xl">
          {p.title}
        </h2>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={p.searchPlaceholder}
          className="mx-auto mt-8 block w-full rounded-lg border border-line bg-card px-4 py-3 text-fg outline-none transition placeholder:text-muted focus:border-accent md:w-96"
        />

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={
                'relative rounded-full px-4 py-2 text-sm transition ' +
                (activeCategory === key
                  ? 'font-semibold text-white'
                  : 'bg-card text-body hover:text-accent')
              }
            >
              {activeCategory === key && (
                <motion.span
                  layoutId="activeCategory"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-brand"
                />
              )}
              <span className="relative">{p.categories[key]}</span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {p.count(filteredProjects.length)}
        </p>

        <motion.div
          layout
          className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const info = p.items[project.id]
              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ y: -8 }}
                  className="flex flex-col rounded-xl border border-line bg-card p-6 transition-colors hover:border-accent hover:shadow-lg hover:shadow-brand/10"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-accent">
                      {p.categories[project.category]}
                    </span>
                    <span className="flex items-center gap-2 text-muted">
                      <span
                        className={
                          'h-2 w-2 rounded-full ' +
                          (project.status === 'ongoing'
                            ? 'animate-pulse bg-yellow-400'
                            : 'bg-green-400')
                        }
                      ></span>
                      {p.status[project.status]}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold text-fg">
                    {info.title}
                  </h3>
                  <p className="mt-2 text-muted">{info.description}</p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md bg-chip px-2 py-1 text-xs text-body"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex gap-4 pt-6 text-sm font-semibold">
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent transition hover:translate-x-1"
                    >
                      {p.demo}
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-body transition hover:translate-x-1 hover:text-fg"
                    >
                      {p.github}
                    </a>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-center text-muted"
          >
            {p.empty}
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default Projects