import { motion } from 'framer-motion'
import { useSettings } from '../context/settings'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const card = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
}

function Education() {
  const { t } = useSettings()

  return (
    <section id="formations" className="scroll-mt-20 bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-fg md:text-4xl">
          {t.education.title}
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid gap-6 md:grid-cols-2"
        >
          {t.education.items.map((edu) => (
            <motion.article
              key={edu.id}
              variants={card}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-xl border border-line bg-card p-6 transition-colors hover:border-accent"
            >
              <span className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"></span>

              <p className="flex items-center gap-2 text-sm text-accent">
                {edu.ongoing && (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                )}
                {edu.period}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-fg">{edu.diploma}</h3>
              <p className="mt-1 text-muted">{edu.institution}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Education