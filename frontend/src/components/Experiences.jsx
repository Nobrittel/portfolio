import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useSettings } from '../context/settings'

function Experiences() {
  const { t } = useSettings()
  const listRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 75%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 })

  return (
    <section id="experiences" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-fg md:text-4xl">
          {t.experience.title}
        </h2>

        <ol ref={listRef} className="relative mt-10">
          <div className="absolute left-0 top-0 h-full w-px bg-line"></div>
          <motion.div
            style={{ scaleY }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-accent"
          />

          {t.experience.items.map((exp) => (
            <motion.li
              key={exp.id}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="relative pb-10 pl-8 last:pb-0"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-brand/20"
              />

              <p className="text-sm text-accent">{exp.period}</p>
              <h3 className="mt-1 text-xl font-semibold text-fg">{exp.position}</h3>
              <p className="text-muted">
                {exp.company}
                {exp.location ? ' · ' + exp.location : ''}
              </p>

              <ul className="mt-3 max-w-2xl list-disc space-y-1 pl-5 text-body">
                {exp.missions.map((mission) => (
                  <li key={mission}>{mission}</li>
                ))}
              </ul>

              <ul className="mt-4 flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
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
    </section>
  )
}

export default Experiences