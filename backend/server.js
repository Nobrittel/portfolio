import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { prisma } from './lib/prisma.js'
import projectsRouter from './routes/projects.js'
import contentRouter from './routes/content.js'
import messagesRouter from './routes/messages.js'
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import adminEventsRouter from './routes/adminEvents.js'
import adminGalleryRouter from './routes/adminGallery.js'
import trackRouter from './routes/track.js'
import seoRouter from './routes/seo.js'
import uploadsRouter, { UPLOAD_DIR } from './routes/uploads.js'
import settingsRouter, { adminSettingsRouter } from './routes/settings.js'
import { requireAuth, requireAdmin } from './middleware/auth.js'

dotenv.config()

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET manquant ou trop court (32 caractères minimum) dans .env')
  process.exit(1)
}

const app = express()

// Le serveur est derrière 2 intermédiaires en production (Netlify puis Render) :
// sans ce réglage, tous les visiteurs auraient la même adresse IP pour les limites anti-abus
app.set('trust proxy', 2)

const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.disable('x-powered-by')

app.disable('x-powered-by')
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

// Protection CSRF : les requêtes qui modifient des données doivent venir de ton site
function checkOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()

  const origin = req.get('origin')
  if (origin && origin !== CLIENT_URL) {
    return res.status(403).json({ error: 'Origine non autorisée' })
  }
  next()
}
app.use('/api', checkOrigin)

const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de messages envoyés. Réessaie plus tard.' },
})

// Vues et clics : assez large pour un visiteur normal, bloque les envois en boucle
const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Trop de requêtes.' },
})

// Fichiers envoyés depuis l'administration (visibles par tous les visiteurs)
app.use('/uploads', express.static(UPLOAD_DIR, { index: false, dotfiles: 'deny' }))

// robots.txt et sitemap.xml pour les moteurs de recherche
app.use('/', seoRouter)

app.get('/api/health', async (req, res) => {
  const projects = await prisma.project.count()
  res.json({ status: 'ok', database: 'connected', projects })
})
// Réponse immédiate, sans base de données : sert aux vérifications automatiques
// (Render, moniteur) sans réveiller ni user la base Neon.
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' })
})
// Réponse immédiate, sans base de données : sert aux vérifications automatiques
// (Render, moniteur) sans réveiller la base Neon.
app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' })
})
app.use('/api/auth', authRouter)
app.use('/api/admin/uploads', requireAuth, requireAdmin, uploadsRouter)
app.use('/api/admin/gallery', requireAuth, requireAdmin, adminGalleryRouter)
app.use('/api/admin/settings', requireAuth, requireAdmin, adminSettingsRouter)
app.use('/api/admin/events', requireAuth, requireAdmin, adminEventsRouter)
app.use('/api/admin', requireAuth, requireAdmin, adminRouter)

app.use('/api/track', trackLimiter, trackRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/messages', messageLimiter, messagesRouter)
app.use('/api', contentRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Erreur serveur' })
})

app.listen(PORT, () => {
  console.log('Serveur démarré sur http://localhost:' + PORT)
})