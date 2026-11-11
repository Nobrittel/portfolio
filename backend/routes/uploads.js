import { Router } from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { v2 as cloudinary } from 'cloudinary'

// Protégée dans server.js par requireAuth et requireAdmin.
const router = Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
await fs.mkdir(UPLOAD_DIR, { recursive: true })

// Cloudinary est utilisé si les 3 variables sont présentes dans .env,
// sinon les fichiers restent sur le disque (mode développement).
const cloudEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
)

if (cloudEnabled) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}
console.log('Stockage des fichiers :', cloudEnabled ? 'Cloudinary' : 'disque local')

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

function uploadToCloud(buffer, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => (error ? reject(error) : resolve(result)))
      .end(buffer)
  })
}

// Enregistre le fichier et renvoie son adresse :
// "/uploads/xxxx.jpg" (disque) ou "https://res.cloudinary.com/..." (Cloudinary)
async function storeFile(buffer, extension) {
  const id = crypto.randomUUID()

  if (!cloudEnabled) {
    const name = id + '.' + extension
    await fs.writeFile(path.join(UPLOAD_DIR, name), buffer)
    return '/uploads/' + name
  }

  const result =
    extension === 'pdf'
      ? await uploadToCloud(buffer, {
          public_id: 'portfolio/' + id + '.pdf',
          resource_type: 'raw',
        })
      : await uploadToCloud(buffer, {
          public_id: 'portfolio/' + id,
          resource_type: 'image',
        })

  return result.secure_url
}

// Supprime un fichier que nous avons créé (disque ou Cloudinary).
// Les adresses qui ne viennent pas de nous sont ignorées.
const LOCAL_FILE = /^\/uploads\/[0-9a-f-]{36}\.(jpg|png|webp|pdf)$/
const CLOUD_FILE =
  /^https:\/\/res\.cloudinary\.com\/([^/]+)\/(image|raw)\/upload\/(?:[^/]+\/)*?(portfolio\/[0-9a-f-]{36})(\.pdf|\.jpg|\.png|\.webp)?$/

export async function deleteStoredFile(url) {
  if (LOCAL_FILE.test(url)) {
    await fs.unlink(path.join(UPLOAD_DIR, path.basename(url))).catch(() => {})
    return
  }

  const match = cloudEnabled ? url.match(CLOUD_FILE) : null
  if (!match || match[1] !== process.env.CLOUDINARY_CLOUD_NAME) return

  const [, , type, publicId, extension] = match
  await cloudinary.uploader
    .destroy(type === 'raw' ? publicId + (extension || '') : publicId, {
      resource_type: type,
    })
    .catch(() => {})
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

        const stored = await storeFile(req.file.buffer, extension)
        res.status(201).json({ path: stored })
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