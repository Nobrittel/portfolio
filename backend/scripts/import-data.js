import 'dotenv/config'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { prisma } from '../lib/prisma.js'

// Sécurité 1 : on n'écrit que dans une base Neon
const url = process.env.DATABASE_URL || ''
const host = url.split('@')[1]?.split('/')[0] || ''
if (!host.includes('neon.tech')) {
  console.error("STOP : DATABASE_URL ne pointe pas vers Neon (hôte : " + (host || 'inconnu') + ").")
  process.exit(1)
}
console.log('Base cible :', host)

// Sécurité 2 : on n'écrit que dans une base vide (évite les doublons)
const existing = (await prisma.project.count()) + (await prisma.skill.count())
if (existing > 0) {
  console.error("STOP : la base Neon contient déjà des données. Rien n'a été copié.")
  process.exit(1)
}

const file = path.join(os.homedir(), 'portfolio-export.json')
const data = JSON.parse(fs.readFileSync(file, 'utf8'))

// On garde les mêmes identifiants pour que les liens entre tables restent valides
await prisma.category.createMany({ data: data.categories })
await prisma.technology.createMany({ data: data.technologies })

for (const { technologies, ...project } of data.projects) {
  await prisma.project.create({
    data: { ...project, technologies: { connect: technologies } },
  })
}

await prisma.projectImage.createMany({ data: data.projectImages })
await prisma.skill.createMany({ data: data.skills })
await prisma.experience.createMany({ data: data.experiences })
await prisma.education.createMany({ data: data.educations })
await prisma.service.createMany({ data: data.services })

// Les compteurs d'identifiants repartent après le plus grand identifiant copié
for (const table of [
  'Category', 'Technology', 'Project', 'ProjectImage',
  'Skill', 'Experience', 'Education', 'Service',
]) {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM "${table}"`
  )
}

console.log('Copie terminée vers Neon.')
for (const [name, rows] of Object.entries(data)) {
  console.log(' -', name + ' :', rows.length)
}

await prisma.$disconnect()