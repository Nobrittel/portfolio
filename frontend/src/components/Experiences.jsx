import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useSettings } from '../context/settings'
import { useApi } from '../hooks/useApi'
import DataStatus from './DataStatus'

function Timeline({ items, suffix }) {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 })

  return (
    <div ref={containerRef} className="relative mt-10">
      {/* Traits décoratifs : hors de la liste, et ignorés par les lecteurs d'écran */}
      <div aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-line"></div>
      <motion.div
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
      />

      <ol>
        {items.map((exp) => (
          <motion.li
            key={exp.id}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative pb-10 pl-8 last:pb-0"
          >
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
              className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-brand/20"
            />

            <p className="text-sm text-accent">{exp['period' + suffix]}</p>
            <h3 className="mt-1 text-xl font-semibold text-fg">
              {exp['position' + suffix]}
            </h3>
            <p className="text-muted">
              {exp.company}
              {exp.location ? ' · ' + exp.location : ''}
            </p>

            <ul className="mt-3 max-w-2xl list-disc space-y-1 pl-5 text-body">
              {(exp['missions' + suffix] ?? []).map((mission) => (
                <li key={mission}>{mission}</li>
              ))}
            </ul>

            <ul className="mt-4 flex flex-wrap gap-2">
              {(exp['tags' + suffix] ?? []).map((tag) => (
                <motion.li
                  key={tag}
                  whileHover={{ y: -3 }}
                  className="rounded-md bg-chip px-2 py-1 text-xs text-body"
                >
                  {tag}
                </motion.li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}

function Experiences() {
  const { t, lang } = useSettings()
  const suffix = lang === 'fr' ? 'Fr' : 'En'
  const { data, loading, error } = useApi('/api/experiences')

  return (
    <section id="experiences" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-fg md:text-4xl">
          {t.experience.title}
        </h2>

        <DataStatus loading={loading} error={error} />

        {data && <Timeline items={data} suffix={suffix} />}
      </div>
    </section>
  )
}

export default Experiences