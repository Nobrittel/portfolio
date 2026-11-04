import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

// Route publique : le site envoie ici une vue (VIEW) ou un clic sur un lien (CLICK).
// Rien de personnel n'est enregistré : ni adresse IP, ni identifiant de visiteur.
const router = Router()

const trackSchema = z
  .object({
    type: z.enum(['VIEW', 'CLICK']),
    label: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .regex(/^[a-z0-9_.:-]+$/i, 'Caractères non autorisés')
      .optional(),
    path: z.string().trim().max(200).regex(/^\//).optional(),
  })
  .refine((data) => data.type !== 'CLICK' || Boolean(data.label), {
    message: 'Le nom du lien est obligatoire pour un clic',
    path: ['label'],
  })

router.post('/', async (req, res) => {
  const result = trackSchema.safeParse(req.body ?? {})
  if (!result.success) {
    return res.status(400).json({ error: 'Données invalides' })
  }

  const { type, label, path } = result.data
  await prisma.event.create({
    data: { type, label: label ?? null, path: path ?? null },
  })
  res.status(204).end()
})

export default router