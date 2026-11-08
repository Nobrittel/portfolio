import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

const router = Router()

// Adresse publique du site, sans "/" final.
// En local : http://localhost:5173. En ligne : l'adresse donnée par l'hébergeur.
function siteUrl() {
  return (process.env.SITE_URL || 'http://localhost:5173').replace(/\/+$/, '')
}

// Caractères interdits dans du XML
function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

router.get('/robots.txt', (req, res) => {
  const lines = [
    'User-agent: *',
    'Disallow: /admin',
    '',
    'Sitemap: ' + siteUrl() + '/sitemap.xml',
    '',
  ]
  res.type('text/plain').send(lines.join('\n'))
})

router.get('/sitemap.xml', async (req, res) => {
  const base = siteUrl()

  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { id: 'asc' },
  })

  const urls = [
    { loc: base + '/', lastmod: null },
    ...projects.map((project) => ({
      loc: base + '/projets/' + encodeURIComponent(project.slug),
      lastmod: project.updatedAt.toISOString().slice(0, 10),
    })),
  ]

  const body = urls
    .map(
      (url) =>
        '  <url>\n' +
        '    <loc>' + escapeXml(url.loc) + '</loc>\n' +
        (url.lastmod ? '    <lastmod>' + url.lastmod + '</lastmod>\n' : '') +
        '  </url>'
    )
    .join('\n')

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    '\n</urlset>\n'

  res.type('application/xml').send(xml)
})

export default router