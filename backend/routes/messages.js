import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/', async (req, res) => {
  const body = req.body ?? {}

  const data = {
    name: String(body.name ?? '').trim(),
    email: String(body.email ?? '').trim(),
    subject: String(body.subject ?? '').trim(),
    content: String(body.message ?? '').trim(),
  }

  const errors = {}
  if (data.name.length < 2 || data.name.length > 100) {
    errors.name = 'Le nom doit contenir entre 2 et 100 caractères.'
  }
  if (!emailPattern.test(data.email) || data.email.length > 150) {
    errors.email = "L'adresse email n'est pas valide."
  }
  if (data.subject.length < 3 || data.subject.length > 150) {
    errors.subject = 'Le sujet doit contenir entre 3 et 150 caractères.'
  }
  if (data.content.length < 10 || data.content.length > 5000) {
    errors.message = 'Le message doit contenir entre 10 et 5000 caractères.'
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors })
  }

  await prisma.message.create({ data })
  res.status(201).json({ success: true })
})

export default router