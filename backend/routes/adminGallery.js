import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { deleteStoredFile } from './uploads.js'

// Protégée dans server.js par requireAuth et requireAdmin.
const router = Router()

const MAX_IMAGES = 12

const bodySchema = z.object({
  url: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .refine((value) => /^(\/|https?:\/\/)/i.test(value), 'Chemin commençant par / ou URL http(s)'),
})

function toId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

// Supprime le fichier seulement s'il n'est plus utilisé nulle part
async function removeFileIfUnused(url) {
  const [inGallery, asMainImage, inSettings] = await Promise.all([
    prisma.projectImage.count({ where: { url } }),
    prisma.project.count({ where: { image: url } }),
    prisma.setting.count({ where: { value: url } }),
  ])
  if (inGallery > 0 || asMainImage > 0 || inSettings > 0) return

  await deleteStoredFile(url)
}

// Ajouter une image à la galerie d'un projet
router.post('/projects/:projectId/images', async (req, res) => {
  const projectId = toId(req.params.projectId)
  if (!projectId) return res.status(400).json({ error: 'Identifiant invalide' })

  const result = bodySchema.safeParse(req.body ?? {})
  if (!result.success) {
    return res.status(400).json({ errors: { url: result.error.issues[0].message } })
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  })
  if (!project) return res.status(404).json({ error: 'Projet introuvable' })

  const count = await prisma.projectImage.count({ where: { projectId } })
  if (count >= MAX_IMAGES) {
    return res.status(400).json({ error: 'Galerie pleine (' + MAX_IMAGES + ' images maximum)' })
  }

  const image = await prisma.projectImage.create({
    data: { url: result.data.url, projectId },
  })
  res.status(201).json(image)
})

// Retirer une image de la galerie
router.delete('/images/:imageId', async (req, res) => {
  const id = toId(req.params.imageId)
  if (!id) return res.status(400).json({ error: 'Identifiant invalide' })

  const image = await prisma.projectImage.findUnique({ where: { id } })
  if (!image) return res.status(404).json({ error: 'Image introuvable' })

  await prisma.projectImage.delete({ where: { id } })
  await removeFileIfUnused(image.url)

  res.status(204).end()
})

export default router