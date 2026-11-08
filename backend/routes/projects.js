import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

function formatProject(project) {
  return {
    ...project,
    technologies: project.technologies.map((tech) => tech.name),
  }
}

router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { published: true },
    include: { category: true, technologies: true },
    orderBy: [{ featured: 'desc' }, { id: 'asc' }],
  })
  res.json(projects.map(formatProject))
})

router.get('/:slug', async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { slug: req.params.slug, published: true },
    include: {
      category: true,
      technologies: true,
      images: { orderBy: { id: 'asc' } },
    },
  })

  if (!project) {
    return res.status(404).json({ error: 'Projet introuvable' })
  }

  res.json(formatProject(project))
})

export default router