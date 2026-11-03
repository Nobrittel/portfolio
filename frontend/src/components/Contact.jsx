import { useState } from 'react'
import { useSettings } from '../context/settings'

function Contact() {
  const { t } = useSettings()
  const c = t.contact

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  // À MODIFIER : remplace par tes vraies coordonnées
  const links = [
    { name: 'Email', value: 'ton.email@exemple.com', href: 'mailto:ton.email@exemple.com' },
    { name: 'GitHub', value: 'github.com/ton-compte', href: 'https://github.com/' },
    { name: 'LinkedIn', value: 'linkedin.com/in/ton-profil', href: 'https://linkedin.com/' },
    { name: 'WhatsApp', value: c.whatsapp, href: 'https://wa.me/' },
  ]

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Message à envoyer :', form)
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
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
                href="/cv.pdf"
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
                value={form.message}
                onChange={handleChange}
                className={inputClass}
              ></textarea>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-hover"
            >
              {c.send}
            </button>

            {sent && <p className="text-green-500">{c.success}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact