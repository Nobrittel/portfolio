import { z } from 'zod'

// ---------- Briques réutilisables ----------
const text = (min, max) => z.string().trim().min(min).max(max)

const emptyToNull = (value) => (value === undefined ? undefined : value || null)

const optionalText = (max) =>
  z.string().trim().max(max).nullable().optional().transform(emptyToNull)

// Seules les URL http(s) sont acceptées : "javascript:..." est refusé (protection XSS)
const urlField = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => value === '' || /^https?:\/\//i.test(value),
    "L'URL doit commencer par http:// ou https://"
  )
  .nullable()
  .optional()
  .transform(emptyToNull)

const imageField = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => value === '' || /^(\/|https?:\/\/)/i.test(value),
    'Chemin commençant par / ou URL http(s)'
  )
  .nullable()
  .optional()
  .transform(emptyToNull)

const stringList = z.array(text(1, 500)).max(20)

const sortOrder = z.number().int().min(0).max(1000).optional()

// ---------- Projets ----------
export const projectSchema = z.object({
  slug: text(2, 100).regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug : lettres minuscules, chiffres et tirets uniquement'
  ),
  titleFr: text(2, 150),
  titleEn: text(2, 150),
  shortDescFr: text(5, 500),
  shortDescEn: text(5, 500),
  descriptionFr: text(5, 10000),
  descriptionEn: text(5, 10000),
  image: imageField,
  githubUrl: urlField,
  demoUrl: urlField,
  progress: z.enum(['done', 'ongoing']).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  projectDate: z.coerce.date().nullable().optional(),
  categorySlug: z.string().trim().max(100).nullable().optional(),
  technologies: z.array(text(1, 50)).max(30).optional(),
})

// ---------- Compétences ----------
export const skillSchema = z.object({
  name: text(1, 80),
  group: z.enum(['frontend', 'backend', 'database', 'tools', 'methods']),
  icon: optionalText(100),
  sortOrder,
})

// ---------- Expériences ----------
export const experienceSchema = z.object({
  positionFr: text(2, 150),
  positionEn: text(2, 150),
  company: text(2, 200),
  location: optionalText(100),
  periodFr: text(2, 100),
  periodEn: text(2, 100),
  missionsFr: stringList,
  missionsEn: stringList,
  tagsFr: stringList,
  tagsEn: stringList,
  sortOrder,
})

// ---------- Formations ----------
export const educationSchema = z.object({
  diplomaFr: text(2, 250),
  diplomaEn: text(2, 250),
  institution: text(2, 200),
  periodFr: text(2, 100),
  periodEn: text(2, 100),
  ongoing: z.boolean().optional(),
  sortOrder,
})

// ---------- Services ----------
export const serviceSchema = z.object({
  titleFr: text(2, 150),
  titleEn: text(2, 150),
  descriptionFr: text(5, 2000),
  descriptionEn: text(5, 2000),
  icon: optionalText(100),
  sortOrder,
})

// ---------- Messages ----------
export const messageStatusSchema = z.object({
  status: z.enum(['NEW', 'READ', 'HANDLED']),
})