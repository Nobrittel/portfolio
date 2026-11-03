import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

router.get('/skills', async (req, res) => {
  const skills = await prisma.skill.findMany({
    orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }],
  })
  res.json(skills)
})

router.get('/experiences', async (req, res) => {
  const experiences = await prisma.experience.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  res.json(experiences)
})

router.get('/educations', async (req, res) => {
  const educations = await prisma.education.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  res.json(educations)
})

router.get('/services', async (req, res) => {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  res.json(services)
})

export default router