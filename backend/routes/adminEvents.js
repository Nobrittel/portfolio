import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

// Protégée dans server.js par requireAuth et requireAdmin.
const router = Router()

router.get('/summary', async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [views, clicks, views30, clicks30, byLabel] = await Promise.all([
    prisma.event.count({ where: { type: 'VIEW' } }),
    prisma.event.count({ where: { type: 'CLICK' } }),
    prisma.event.count({ where: { type: 'VIEW', createdAt: { gte: since } } }),
    prisma.event.count({ where: { type: 'CLICK', createdAt: { gte: since } } }),
    prisma.event.groupBy({
      by: ['label'],
      where: { type: 'CLICK' },
      _count: { _all: true },
    }),
  ])

  const links = byLabel
    .map((row) => ({ label: row.label || 'inconnu', count: row._count._all }))
    .sort((a, b) => b.count - a.count)

  res.json({ views, clicks, views30, clicks30, links })
})

export default router