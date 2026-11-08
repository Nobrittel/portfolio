import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSettings } from '../context/settings'
import { useApi } from '../hooks/useApi'
import { imageUrl } from '../api'

// Petits textes propres à cette page
const labels = {
  fr: {
    back: '← Retour au site',
    notFound: "Ce projet n'existe pas ou n'est plus disponible.",
    technologies: 'Technologies',
    about: 'À propos du projet',
    gallery: 'Galerie',
  },
  en: {
    back: '← Back to site',
    notFound: 'This project does not exist or is no longer available.',
    technologies: 'Technologies',
    about: 'About the project',
    gallery: 'Gallery',
  },
}

const backButtonClass =
  'inline-block rounded-lg border border-line px-4 py-2 text-sm font-semibold text-fg transition hover:border-accent hover:text-accent'

// Nom du lien dans les statistiques, ex : projet-mon-portfolio-github
function trackName(slug, kind) {
  return ('projet-' + slug + '-' + kind).slice(0, 60)
}

function ProjectDetail() {
  const { slug } = useParams()
  const { t, lang, setLang, theme, toggleTheme } = useSettings()
  const p = t.projects
  const l = labels[lang] ?? labels.fr
  const suffix = lang === 'fr' ? 'Fr' : 'En'

  const { data: project, loading, error } = useApi('/api/projects/' + encodeURIComponent(slug))

  const title = project ? project['title' + suffix] : ''

  // Titre de l'onglet du navigateur
  useEffect(() => {
    if (!title) return
    const previous = document.title
    document.title = title + ' | Loïc Noudehouenou'
    return () => {
      document.title = previous
    }
  }, [title])

  const header = (
    <header className="sticky top-0 z-40 border-b border-line bg-page/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
        <a href="/#projets" className={backButtonClass}>
          {l.back}
        </a>

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
                  (lang === code ? 'bg-brand text-white' : 'text-muted hover:text-accent')
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
        </div>
      </div>
    </header>
  )

  // Chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-page text-fg">
        {header}
        <p className="mx-auto max-w-4xl px-6 py-16 text-muted">{t.common.loading}</p>
      </div>
    )
  }

  // Projet introuvable (adresse fausse, brouillon, serveur éteint)
  if (error || !project) {
    return (
      <div className="min-h-screen bg-page text-fg">
        {header}
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-lg text-muted">{l.notFound}</p>
          <a href="/#projets" className={backButtonClass + ' mt-6'}>
            {l.back}
          </a>
        </div>
      </div>
    )
  }

  const projectSlug = project.slug || slug
  const categorySlug = project.category ? project.category.slug : ''

  const description =
    project['description' + suffix] || project['shortDesc' + suffix] || ''
  const paragraphs = description
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)

  const technologies = (project.technologies || []).map((tech) =>
    typeof tech === 'string' ? tech : tech.name
  )

  const gallery = (Array.isArray(project.images) ? project.images : [])
    .map((img) => (typeof img === 'string' ? img : img.url))
    .filter(Boolean)

  const date = project.projectDate
    ? new Date(project.projectDate).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
        year: 'numeric',
        month: 'long',
      })
    : ''

  return (
    <div className="min-h-screen bg-page text-fg">
      {header}

      <main className="mx-auto max-w-4xl px-6 py-12">
        {project.image && (
          <img
            src={imageUrl(project.image)}
            alt={title}
            className="mb-8 max-h-96 w-full rounded-xl border border-line object-cover"
          />
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="text-accent">{p.categories[categorySlug] ?? ''}</span>
          <span className="flex items-center gap-2 text-muted">
            <span
              className={
                'h-2 w-2 rounded-full ' +
                (project.progress === 'ongoing' ? 'animate-pulse bg-yellow-400' : 'bg-green-400')
              }
            ></span>
            {p.status[project.progress] ?? project.progress}
          </span>
          {date && <span className="text-muted">{date}</span>}
        </div>

        <h1 className="mt-3 text-3xl font-bold md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted">{project['shortDesc' + suffix]}</p>

        {technologies.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {l.technologies}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <li key={tech} className="rounded-md bg-chip px-3 py-1 text-sm text-body">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(project.demoUrl || project.githubUrl) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                data-track={trackName(projectSlug, 'demo')}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-hover"
              >
                {p.demo}
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                data-track={trackName(projectSlug, 'github')}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line px-6 py-3 font-semibold text-fg transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                {p.github}
              </a>
            )}
          </div>
        )}

        {paragraphs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">{l.about}</h2>
            <div className="mt-4 space-y-4 text-lg text-body">
              {paragraphs.map((text, index) => (
                <p key={index} className="whitespace-pre-line">
                  {text}
                </p>
              ))}
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold">{l.gallery}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {gallery.map((url) => (
                <li key={url}>
                  <img
                    src={imageUrl(url)}
                    alt={title}
                    loading="lazy"
                    className="h-56 w-full rounded-xl border border-line object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}

export default ProjectDetail