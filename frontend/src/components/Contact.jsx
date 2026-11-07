import { useState } from 'react'
import { useSettings } from '../context/settings'
import { useApi } from '../hooks/useApi'
import { API_URL, imageUrl } from '../api'

const emptyForm = { name: '', email: '', subject: '', message: '' }

function Contact() {
  const { t } = useSettings()
  const c = t.contact

  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  // CV choisi dans l'administration, sinon le CV par défaut
  const { data: settings } = useApi('/api/settings')
  const cvHref = settings?.cv ? imageUrl(settings.cv) : '/cv.pdf'

  // "track" = nom du lien dans les statistiques (lettres, chiffres, tirets)
  const links = [
    {
      name: 'Email',
      track: 'email',
      value: 'loicnoudehouenou693@gmail.com',
      href: 'mailto:loicnoudehouenou693@gmail.com',
    },
    {
      name: 'GitHub',
      track: 'github',
      value: 'github.com/Nobrittel',
      href: 'https://github.com/Nobrittel/',
    },
    {
      name: 'LinkedIn',
      track: 'linkedin',
      value: 'linkedin.com/in/loicnoudehouenou',
      href: 'https://www.linkedin.com/in/loicnoudehouenou/',
    },
    {
      name: 'WhatsApp',
      track: 'whatsapp',
      value: c.whatsapp,
      href: 'https://wa.me/+2290160748998',
    },
  ]

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch(API_URL + '/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) throw new Error('HTTP ' + response.status)

      setStatus('success')
      setForm(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'mt-2 w-full rounded-lg border border-line bg-card px-4 py-3 text-fg outline-none placeholder:text-muted focus:border-accent'

  return (
    <section id="contact" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-fg md:text-4xl">
          {c.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted">{c.intro}</p>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  data-track={link.track}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-line bg-card p-4 transition hover:border-accent"
                >
                  <p className="text-sm text-accent">{link.name}</p>
                  <p className="text-body">{link.value}</p>
                </a>
              </li>
            ))}

            <li>
              <a
                href={cvHref}
                data-track="cv"
                target="_blank"
                rel="noreferrer"
                download
                className="inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-hover"
              >
                {c.cv}
              </a>
            </li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="text-sm text-body">
                {c.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm text-body">
                {c.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={150}
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="subject" className="text-sm text-body">
                {c.subject}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                minLength={3}
                maxLength={150}
                value={form.subject}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm text-body">
                {c.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                minLength={10}
                maxLength={5000}
                value={form.message}
                onChange={handleChange}
                className={inputClass}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'sending' ? c.sending : c.send}
            </button>

            {status === 'success' && <p className="text-green-500">{c.success}</p>}
            {status === 'error' && <p className="text-red-500">{c.error}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact