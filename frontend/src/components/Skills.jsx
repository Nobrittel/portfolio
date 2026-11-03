import { motion } from 'framer-motion'
import { useSettings } from '../context/settings'

const groups = [
  {
    key: 'frontend',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Bootstrap', 'Tailwind CSS'],
  },
  {
    key: 'backend',
    items: ['Node.js', 'Express.js', 'PHP', 'Laravel', 'API REST'],
  },
  {
    key: 'database',
    items: ['MySQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    key: 'tools',
    items: ['Git', 'GitHub', 'VS Code', 'Postman'],
  },
  {
    key: 'methods',
    items: ['Agile', 'Scrum', 'UML'],
  },
]

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const badgeList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
}

const badge = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 18 },
  },
}

function Skills() {
  const { t } = useSettings()

  return (
    <section id="competences" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-fg md:text-4xl">
          {t.skills.title}
        </h2>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {groups.map((group) => (
            <motion.div
              key={group.key}
              variants={card}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-xl border border-line bg-card p-6 transition-colors hover:border-accent"
            >
              <span className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"></span>

              <h3 className="text-xl font-semibold text-accent">
                {t.skills.groups[group.key]}
              </h3>

              <motion.ul variants={badgeList} className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    variants={badge}
                    whileHover={{ scale: 1.12, y: -2 }}
                    className="cursor-default rounded-md bg-chip px-3 py-1 text-sm text-body transition-colors hover:text-accent"
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills