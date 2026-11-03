import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma.js'
import projectsRouter from './routes/projects.js'
import contentRouter from './routes/content.js'
import messagesRouter from './routes/messages.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.disable('x-powered-by')
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', async (req, res) => {
  const projects = await prisma.project.count()
  res.json({ status: 'ok', database: 'connected', projects })
})

app.use('/api/projects', projectsRouter)
app.use('/api/messages', messagesRouter)
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