import { useEffect, useRef } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { useSettings } from '../context/settings'

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

const textItem = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

const statItem = {
  hidden: { opacity: 0, scale: 0.7, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
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

function About() {
  const { t } = useSettings()

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

          <motion.ul
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-3 gap-4 self-start"
          >
            {t.about.stats.map((stat) => (
              <motion.li
                key={stat.label}
                variants={statItem}
                whileHover={{ y: -6 }}
                className="rounded-xl border border-line bg-card p-4 text-center transition-colors hover:border-accent"
              >
                <p className="text-3xl font-bold text-accent">
                  <CountUp to={stat.to} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

export default About