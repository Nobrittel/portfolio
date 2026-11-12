import 'dotenv/config'
import mariadb from 'mariadb'
import { prisma } from '../lib/prisma.js'

// Copie unique : lit l'ancienne base MySQL (variables DATABASE_HOST, ...)
// et recopie tout dans PostgreSQL (DATABASE_URL). Ne modifie jamais MySQL.
const mysql = mariadb.createPool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 2,
  timezone: 'Z', // Prisma stocke les dates en UTC : pas de décalage horaire
  bigIntAsNumber: true,
})

const bool = (value) => Boolean(Number(value))
const date = (value) => (value == null ? null : value instanceof Date ? value : new Date(value))
const json = (value) => (typeof value === 'string' ? JSON.parse(value) : value)

// Ordre important : une table liée doit venir après celle dont elle dépend
const tables = [
  { table: 'Category', model: 'category', map: (r) => r },
  { table: 'Technology', model: 'technology', map: (r) => r },
  {
    table: 'Project',
    model: 'project',
    map: (r) => ({
      ...r,
      featured: bool(r.featured),
      published: bool(r.published),
      projectDate: date(r.projectDate),
      createdAt: date(r.createdAt),
      updatedAt: date(r.updatedAt),
    }),
  },
  { table: 'ProjectImage', model: 'projectImage', map: (r) => r },
  { table: 'Skill', model: 'skill', map: (r) => r },
  {
    table: 'Experience',
    model: 'experience',
    map: (r) => ({
      ...r,
      missionsFr: json(r.missionsFr),
      missionsEn: json(r.missionsEn),
      tagsFr: json(r.tagsFr),
      tagsEn: json(r.tagsEn),
    }),
  },
  { table: 'Education', model: 'education', map: (r) => ({ ...r, ongoing: bool(r.ongoing) }) },
  { table: 'Service', model: 'service', map: (r) => r },
  { table: 'Message', model: 'message', map: (r) => ({ ...r, createdAt: date(r.createdAt) }) },
  { table: 'Setting', model: 'setting', map: (r) => r },
  { table: 'Event', model: 'event', map: (r) => ({ ...r, createdAt: date(r.createdAt) }) },
  {
    table: 'User',
    model: 'user',
    map: (r) => ({ ...r, createdAt: date(r.createdAt), updatedAt: date(r.updatedAt) }),
  },
]

async function readMysql(table) {
  const rows = await mysql.query('SELECT * FROM `' + table + '`')
  return Array.from(rows)
}

async function main() {
  // Sécurité : on refuse de copier dans une base PostgreSQL qui contient déjà des données
  for (const { model, table } of tables) {
    const count = await prisma[model].count()
    if (count > 0) {
      throw new Error(
        'La table ' + table + ' de PostgreSQL contient déjà ' + count + ' ligne(s). ' +
          'Vide la base (ou refais "npx prisma migrate reset") avant de relancer la copie.'
      )
    }
  }

  for (const { table, model, map } of tables) {
    const rows = (await readMysql(table)).map(map)

    // Par paquets de 500 pour les grosses tables (vues et clics)
    for (let start = 0; start < rows.length; start += 500) {
      await prisma[model].createMany({ data: rows.slice(start, start + 500) })
    }
    console.log(table + ' : ' + rows.length + ' ligne(s) copiée(s)')

    // La table de liaison projets/technologies se copie dès que les deux existent
    if (table === 'Technology') continue
    if (table === 'Project') {
      const links = await readMysql('_ProjectToTechnology')
      for (const link of links) {
        await prisma.$executeRawUnsafe(
          'INSERT INTO "_ProjectToTechnology" ("A", "B") VALUES ($1, $2)',
          Number(link.A),
          Number(link.B)
        )
      }
      console.log('Liens projets / technologies : ' + links.length + ' ligne(s) copiée(s)')
    }
  }

  // Les identifiants ont été copiés tels quels : on remet les compteurs automatiques à la bonne valeur
  for (const { table } of tables) {
    await prisma.$queryRawUnsafe(
      'SELECT setval(pg_get_serial_sequence(\'"' + table + '"\', \'id\'), ' +
        'GREATEST((SELECT COALESCE(MAX(id), 0) FROM "' + table + '"), 1), ' +
        '(SELECT COUNT(*) FROM "' + table + '") > 0)'
    )
  }

  // Vérification : même nombre de lignes des deux côtés ?
  console.log('\nVérification (MySQL / PostgreSQL) :')
  let allGood = true
  const report = []
  for (const { table, model } of tables) {
    const [row] = await mysql.query('SELECT COUNT(*) AS n FROM `' + table + '`')
    const before = Number(row.n)
    const after = await prisma[model].count()
    if (before !== after) allGood = false
    report.push({ table, mysql: before, postgresql: after, ok: before === after ? 'oui' : 'NON' })
  }
  const [linkBefore] = await mysql.query('SELECT COUNT(*) AS n FROM `_ProjectToTechnology`')
  const linkAfter = await prisma.$queryRawUnsafe('SELECT COUNT(*)::int AS n FROM "_ProjectToTechnology"')
  const linksOk = Number(linkBefore.n) === Number(linkAfter[0].n)
  if (!linksOk) allGood = false
  report.push({
    table: '_ProjectToTechnology',
    mysql: Number(linkBefore.n),
    postgresql: Number(linkAfter[0].n),
    ok: linksOk ? 'oui' : 'NON',
  })
  console.table(report)

  console.log(
    allGood
      ? 'Copie terminée : tous les nombres correspondent.'
      : 'ATTENTION : certains nombres ne correspondent pas, ne supprime pas MySQL.'
  )
}

main()
  .catch((error) => {
    console.error('Échec de la copie :', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mysql.end()
    await prisma.$disconnect()
  })