import { Router } from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Protégée dans server.js par requireAuth et requireAdmin.
const router = Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
await fs.mkdir(UPLOAD_DIR, { recursive: true })

function memoryUpload(maxSize) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSize, files: 1 },
  }).single('file')
}

// On vérifie le contenu réel du fichier, pas son nom ni le type annoncé par le navigateur
function detectImage(buffer) {
  if (buffer.length > 12 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpg'
  }
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  if (buffer.length > 12 && buffer.subarray(0, 8).equals(png)) return 'png'
  if (
    buffer.length > 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp'
  }
  return null
}

function detectPdf(buffer) {
  return buffer.length > 8 && buffer.subarray(0, 5).toString('ascii') === '%PDF-' ? 'pdf' : null
}

function makeHandler({ upload, detect, tooBig, badFormat }) {
  return (req, res, next) => {
    upload(req, res, async (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: tooBig })
        return res.status(400).json({ error: 'Envoi invalide' })
      }

      try {
        if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' })

        const extension = detect(req.file.buffer)
        if (!extension) return res.status(400).json({ error: badFormat })

        const name = crypto.randomUUID() + '.' + extension
        await fs.writeFile(path.join(UPLOAD_DIR, name), req.file.buffer)

        res.status(201).json({ path: '/uploads/' + name })
      } catch (error) {
        next(error)
      }
    })
  }
}

// Images : JPG, PNG, WebP, 5 Mo
router.post(
  '/',
  makeHandler({
    upload: memoryUpload(5 * 1024 * 1024),
    detect: detectImage,
    tooBig: 'Image trop lourde (5 Mo maximum)',
    badFormat: 'Format non accepté (JPG, PNG ou WebP uniquement)',
  })
)

// Documents : PDF, 10 Mo
router.post(
  '/document',
  makeHandler({
    upload: memoryUpload(10 * 1024 * 1024),
    detect: detectPdf,
    tooBig: 'Fichier trop lourd (10 Mo maximum)',
    badFormat: 'Format non accepté (PDF uniquement)',
  })
)

export default router