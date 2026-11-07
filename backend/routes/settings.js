import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

const KEYS = ['profilePhoto', 'cvPath']

async function readSettings() {
  const rows = await prisma.setting.findMany({ where: { key: { in: KEYS } } })
  const settings = { profilePhoto: '', cvPath: '' }
  for (const row of rows) settings[row.key] = row.value
  return settings
}

// ---------- Route publique : lue par le site ----------
const publicRouter = Router()

publicRouter.get('/', async (req, res) => {
  const settings = await readSettings()
  res.json({
    profilePhoto: settings.profilePhoto || null,
    cv: settings.cvPath || null,
  })
})

export default publicRouter

// ---------- Route d'administration (protégée dans server.js) ----------
export const adminSettingsRouter = Router()

const pathField = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => value === '' || /^(\/|https?:\/\/)/i.test(value),
    'Chemin commençant par / ou URL http(s)'
  )
  .optional()

const settingsSchema = z.object({
  profilePhoto: pathField,
  cvPath: pathField,
})

adminSettingsRouter.get('/', async (req, res) => {
  res.json(await readSettings())
})

adminSettingsRouter.put('/', async (req, res) => {
  const result = settingsSchema.safeParse(req.body ?? {})
  if (!result.success) {
    const errors = {}
    for (const issue of result.error.issues) {
      errors[issue.path.join('.') || 'body'] = issue.message
    }
    return res.status(400).json({ errors })
  }

  for (const key of KEYS) {
    const value = result.data[key]
    if (value === undefined) continue

    // Valeur vide : on supprime le réglage, le site reprend le fichier par défaut
    if (value === '') {
      await prisma.setting.deleteMany({ where: { key } })
    } else {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
  }

  res.json(await readSettings())
})