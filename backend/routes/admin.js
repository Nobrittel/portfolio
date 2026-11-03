import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import {
  projectSchema,
  skillSchema,
  experienceSchema,
  educationSchema,
  serviceSchema,
  messageStatusSchema,
} from '../lib/schemas.js'

// Toutes les routes de ce fichier sont protégées dans server.js
// par requireAuth et requireAdmin.
const router = Router()

// ---------- Outils ----------
router.param('id', (req, res, next, value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Identifiant invalide' })
  }
  req.id = id
  next()
})

function parse(schema, body, res) {
  const result = schema.safeParse(body ?? {})
  if (!result.success) {
    const errors = {}
    for (const issue of result.error.issues) {
      errors[issue.path.join('.') || 'body'] = issue.message
    }
    res.status(400).json({ errors })
    return null
  }
  return result.data
}

function handlePrismaError(error, res) {
  if (error.code === 'P2002') {
    return res
      .status(409)
      .json({ error: 'Cette valeur existe déjà (slug ou nom unique).' })
  }
  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Élément introuvable' })
  }
  throw error
}

// ---------- Test d'accès et statistiques ----------
router.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'Accès administrateur autorisé' })
})

router.get('/stats', async (req, res) => {
  const [projects, published, skills, experiences, educations, messages, newMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.message.count(),
      prisma.message.count({ where: { status: 'NEW' } }),
    ])

  res.json({
    projects,
    published,
    drafts: projects - published,
    skills,
    experiences,
    educations,
    messages,
    newMessages,
  })
})

// ---------- Projets ----------
const projectInclude = { category: true, technologies: true, images: true }

async function categoryExists(slug, res) {
  if (!slug) return true
  const category = await prisma.category.findUnique({ where: { slug } })
  if (category) return true
  res.status(400).json({ errors: { categorySlug: 'Catégorie inconnue' } })
  return false
}

async function ensureTechnologies(names) {
  await Promise.all(
    names.map((name) =>
      prisma.technology.upsert({ where: { name }, update: {}, create: { name } })
    )
  )
}

function buildProjectData(input, techNames, isUpdate) {
  const { categorySlug, technologies, ...rest } = input
  const data = { ...rest }

  if (categorySlug !== undefined) {
    if (categorySlug) {
      data.category = { connect: { slug: categorySlug } }
    } else if (isUpdate) {
      data.category = { disconnect: true }
    }
  }

  if (techNames !== undefined) {
    const links = techNames.map((name) => ({ name }))
    data.technologies = isUpdate ? { set: links } : { connect: links }
  }

  return data
}

router.get('/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    include: projectInclude,
    orderBy: { id: 'asc' },
  })
  res.json(projects)
})

router.get('/projects/:id', async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.id },
    include: projectInclude,
  })
  if (!project) return res.status(404).json({ error: 'Projet introuvable' })
  res.json(project)
})

router.post('/projects', async (req, res) => {
  const input = parse(projectSchema, req.body, res)
  if (!input) return
  if (!(await categoryExists(input.categorySlug, res))) return

  try {
    const techNames = input.technologies ? [...new Set(input.technologies)] : undefined
    if (techNames) await ensureTechnologies(techNames)

    const project = await prisma.project.create({
      data: buildProjectData(input, techNames, false),
      include: projectInclude,
    })
    res.status(201).json(project)
  } catch (error) {
    return handlePrismaError(error, res)
  }
})

// PUT accepte une mise à jour partielle : { "published": true } suffit pour publier
router.put('/projects/:id', async (req, res) => {
  const input = parse(projectSchema.partial(), req.body, res)
  if (!input) return
  if (!(await categoryExists(input.categorySlug, res))) return

  try {
    const techNames = input.technologies ? [...new Set(input.technologies)] : undefined
    if (techNames) await ensureTechnologies(techNames)

    const project = await prisma.project.update({
      where: { id: req.id },
      data: buildProjectData(input, techNames, true),
      include: projectInclude,
    })
    res.json(project)
  } catch (error) {
    return handlePrismaError(error, res)
  }
})

router.delete('/projects/:id', async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.id } })
    res.status(204).end()
  } catch (error) {
    return handlePrismaError(error, res)
  }
})

// ---------- Compétences, expériences, formations, services ----------
function crud(path, model, schema, orderBy) {
  router.get('/' + path, async (req, res) => {
    res.json(await prisma[model].findMany({ orderBy }))
  })

  router.post('/' + path, async (req, res) => {
    const data = parse(schema, req.body, res)
    if (!data) return
    try {
      const item = await prisma[model].create({ data })
      res.status(201).json(item)
    } catch (error) {
      return handlePrismaError(error, res)
    }
  })

  router.put('/' + path + '/:id', async (req, res) => {
    const data = parse(schema.partial(), req.body, res)
    if (!data) return
    try {
      const item = await prisma[model].update({ where: { id: req.id }, data })
      res.json(item)
    } catch (error) {
      return handlePrismaError(error, res)
    }
  })

  router.delete('/' + path + '/:id', async (req, res) => {
    try {
      await prisma[model].delete({ where: { id: req.id } })
      res.status(204).end()
    } catch (error) {
      return handlePrismaError(error, res)
    }
  })
}

crud('skills', 'skill', skillSchema, [{ group: 'asc' }, { sortOrder: 'asc' }])
crud('experiences', 'experience', experienceSchema, { sortOrder: 'asc' })
crud('educations', 'education', educationSchema, { sortOrder: 'asc' })
crud('services', 'service', serviceSchema, { sortOrder: 'asc' })

// ---------- Messages reçus ----------
router.get('/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' },
  })
  res.json(messages)
})

router.patch('/messages/:id', async (req, res) => {
  const data = parse(messageStatusSchema, req.body, res)
  if (!data) return
  try {
    const message = await prisma.message.update({
      where: { id: req.id },
      data: { status: data.status },
    })
    res.json(message)
  } catch (error) {
    return handlePrismaError(error, res)
  }
})

router.delete('/messages/:id', async (req, res) => {
  try {
    await prisma.message.delete({ where: { id: req.id } })
    res.status(204).end()
  } catch (error) {
    return handlePrismaError(error, res)
  }
})

export default router