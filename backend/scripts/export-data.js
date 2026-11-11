import 'dotenv/config'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { prisma } from '../lib/prisma.js'

// Le fichier est enregistré dans ton dossier utilisateur, hors du projet (donc jamais sur GitHub)
const file = path.join(os.homedir(), 'portfolio-export.json')

const data = {
  categories: await prisma.category.findMany(),
  technologies: await prisma.technology.findMany(),
  projects: await prisma.project.findMany({
    include: { technologies: { select: { id: true } } },
  }),
  projectImages: await prisma.projectImage.findMany(),
  skills: await prisma.skill.findMany(),
  experiences: await prisma.experience.findMany(),
  educations: await prisma.education.findMany(),
  services: await prisma.service.findMany(),
}

fs.writeFileSync(file, JSON.stringify(data, null, 2))

console.log('Export terminé :', file)
for (const [name, rows] of Object.entries(data)) {
  console.log(' -', name + ' :', rows.length)
}

await prisma.$disconnect()