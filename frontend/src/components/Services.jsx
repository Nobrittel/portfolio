import { motion } from 'framer-motion'
import { useSettings } from '../context/settings'
import { useApi } from '../hooks/useApi'
import DataStatus from './DataStatus'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
}

function Services() {
  const { t, lang } = useSettings()
  const suffix = lang === 'fr' ? 'Fr' : 'En'
  const { data, loading, error } = useApi('/api/services')

  // Aucun service en base : on n'affiche pas la section
  if (data && data.length === 0) return null

  return (
    <section id="services" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-fg md:text-4xl">
          {t.services.title}
        </h2>

        <DataStatus loading={loading} error={error} />

        {data && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {data.map((service) => (
              <motion.article
                key={service.id}
                variants={card}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-xl border border-line bg-card p-6 transition-colors hover:border-accent"
              >
                <span className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"></span>

                {service.icon && <p className="text-3xl">{service.icon}</p>}
                <h3 className="mt-3 text-xl font-semibold text-fg">
                  {service['title' + suffix]}
                </h3>
                <p className="mt-2 text-muted">{service['description' + suffix]}</p>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Services