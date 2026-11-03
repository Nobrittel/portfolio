import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { prisma } from './lib/prisma.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    const projects = await prisma.project.count()
    res.json({ status: 'ok', database: 'connected', projects })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', database: 'unreachable' })
  }
})

app.listen(PORT, () => {
  console.log('Serveur démarré sur http://localhost:' + PORT)
})