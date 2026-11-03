import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { prisma } from '../lib/prisma.js'
import { COOKIE_NAME, getCookieOptions, requireAuth } from '../middleware/auth.js'

const router = Router()

const TWO_HOURS = 2 * 60 * 60

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de tentatives. Réessaie dans 15 minutes.' },
})

// Hash factice : le temps de réponse est le même que l'email existe ou non
const dummyHash = bcrypt.hashSync('mot-de-passe-factice', 12)

router.post('/login', loginLimiter, async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const password = String(req.body?.password ?? '')

  if (!email || !password || password.length > 200) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  const valid = await bcrypt.compare(password, user ? user.password : dummyHash)

  if (!user || !valid) {
    return res.status(401).json({ error: 'Identifiants invalides.' })
  }

  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    subject: String(user.id),
    expiresIn: TWO_HOURS,
  })

  res.cookie(COOKIE_NAME, token, {
    ...getCookieOptions(),
    maxAge: TWO_HOURS * 1000,
  })

  res.json({ user: { id: user.id, name: user.name, email: user.email } })
})

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, getCookieOptions())
  res.json({ success: true })
})

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user) {
    return res.status(401).json({ error: 'Non authentifié' })
  }

  res.json({ user })
})

export default router
