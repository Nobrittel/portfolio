# Portfolio Full-Stack — Loïc NOUDEHOUENOU

🇫🇷 [Français](#-français) · 🇬🇧 [English](#-english)

**Site en ligne / Live site : https://loicnoudehouenou.netlify.app**

---

# 🇫🇷 Français

Portfolio personnel de développeur Full-Stack : un site bilingue (FR/EN) **administrable**, conçu comme une démonstration technique complète. Le contenu (projets, compétences, expériences, formations, services, photo, CV) se gère depuis un espace d'administration sécurisé, sans toucher au code.

## Fonctionnalités

**Site public**
- Accueil, À propos, Compétences, Projets, Expériences, Formations, Services, Contact
- Projets filtrables par catégorie, recherche instantanée, pages de détail (`/projets/mon-projet`) avec galerie et visionneuse d'images
- Logos des technologies détectés automatiquement à partir du nom saisi
- Mode clair / sombre, français / anglais, responsive, animations (Framer Motion)
- Formulaire de contact enregistré en base de données
- SEO : titres et descriptions dynamiques, Open Graph, données structurées, `sitemap.xml` et `robots.txt` générés

**Administration (`/admin`)**
- Connexion sécurisée (cookie httpOnly, JWT, mots de passe hachés)
- CRUD des projets (publication, projet vedette, galerie), compétences, expériences, formations, services
- Boîte de réception des messages (nouveau / lu / traité)
- Photo de profil et CV modifiables
- Statistiques de vues et de clics sur les liens

## Technologies

| Couche | Outils |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4, Framer Motion, React Router |
| Backend | Node.js, Express 5, Zod, Multer |
| Base de données | PostgreSQL, Prisma ORM |
| Fichiers | Cloudinary |
| Hébergement | Netlify (site), Render (API), Neon (base de données) |

## Architecture

```text
Navigateur ──► Netlify (React) ──/api──► Render (Express) ──► Prisma ──► Neon (PostgreSQL)
                                                  └──────────────────────► Cloudinary (images, CV)
```

Netlify redirige `/api`, `/uploads`, `/sitemap.xml` et `/robots.txt` vers le serveur : le navigateur ne voit qu'un seul site, ce qui simplifie les cookies et la sécurité.

## Sécurité

- Mots de passe hachés (bcrypt), jeton JWT dans un cookie `httpOnly`, `secure` et `SameSite=Lax`
- Routes d'administration protégées (authentification + rôle)
- Validation de toutes les données avec Zod
- Protection CSRF par vérification de l'en-tête `Origin`
- Limitation du débit (connexion, messages, suivi)
- En-têtes de sécurité (Helmet)
- Fichiers envoyés : type vérifié sur le contenu réel, noms aléatoires, taille limitée
- Secrets uniquement dans les variables d'environnement, jamais dans le code

## Structure du projet

```text
portfolio/
├── backend/
│   ├── prisma/          schéma de la base et migrations
│   ├── routes/          API REST (projets, contenu, messages, auth, admin…)
│   ├── middleware/      authentification
│   ├── scripts/         création de l'administrateur, export/import de données
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── admin/       pages d'administration
        ├── components/  sections du site
        ├── hooks/       chargement des données (cache, nouvelles tentatives)
        ├── i18n/        traductions FR/EN
        └── pages/
```

## Installation en local

Prérequis : Node.js 22+ et PostgreSQL.

```bash
git clone https://github.com/Nobrittel/portfolio.git
cd portfolio
```

**1. Backend**

```bash
cd backend
npm install
```

Créer `backend/.env` :

```env
DATABASE_URL=postgresql://utilisateur:motdepasse@localhost:5432/portfolio_db
JWT_SECRET=une_longue_chaine_aleatoire_de_32_caracteres_minimum
CLIENT_URL=http://localhost:5173
SITE_URL=http://localhost:5173

# Facultatif : sans ces 3 lignes, les fichiers sont stockés sur le disque local
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed            # données de départ (facultatif)
npm run create-admin    # crée le compte administrateur
npm run dev             # http://localhost:5000
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

L'administration est accessible sur `/admin/login`.

## Déploiement

| Service | Rôle | Réglages principaux |
|---|---|---|
| Neon | Base PostgreSQL | adresse « pooled » dans `DATABASE_URL` |
| Render | API Node | racine `backend`, build `npm install --include=dev && npx prisma generate`, démarrage `npm start` |
| Netlify | Site React | base `frontend`, build `npm run build`, redirections dans `frontend/netlify.toml` |
| Cloudinary | Images et CV | variables `CLOUDINARY_*` |

Un moniteur appelle `/api/ping` toutes les 5 minutes pour éviter la mise en veille du plan gratuit de Render.

## Pistes d'évolution

Tests automatisés, blog technique, témoignages, analytics.

## Auteur

**Loïc NOUDEHOUENOU**, développeur Full-Stack
[GitHub](https://github.com/Nobrittel) · [LinkedIn](https://www.linkedin.com/in/loicnoudehouenou/) · [Portfolio](https://loicnoudehouenou.netlify.app)

---

# 🇬🇧 English

A personal Full-Stack developer portfolio: a bilingual (FR/EN), **admin-managed** website built as a complete technical showcase. All content (projects, skills, experience, education, services, photo, résumé) is managed from a secure admin area, with no code changes.

## Features

**Public site**
- Home, About, Skills, Projects, Experience, Education, Services, Contact
- Projects filterable by category, instant search, detail pages (`/projets/my-project`) with gallery and image lightbox
- Technology logos detected automatically from the name entered
- Light / dark mode, French / English, responsive, animations (Framer Motion)
- Contact form stored in the database
- SEO: dynamic titles and descriptions, Open Graph, structured data, generated `sitemap.xml` and `robots.txt`

**Admin area (`/admin`)**
- Secure login (httpOnly cookie, JWT, hashed passwords)
- CRUD for projects (publishing, featured flag, gallery), skills, experience, education, services
- Message inbox (new / read / handled)
- Editable profile photo and résumé
- View and link-click statistics

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS v4, Framer Motion, React Router |
| Backend | Node.js, Express 5, Zod, Multer |
| Database | PostgreSQL, Prisma ORM |
| Files | Cloudinary |
| Hosting | Netlify (site), Render (API), Neon (database) |

## Architecture

```text
Browser ──► Netlify (React) ──/api──► Render (Express) ──► Prisma ──► Neon (PostgreSQL)
                                              └──────────────────────► Cloudinary (images, résumé)
```

Netlify proxies `/api`, `/uploads`, `/sitemap.xml` and `/robots.txt` to the server, so the browser only talks to a single site, which simplifies cookies and security.

## Security

- Hashed passwords (bcrypt), JWT in an `httpOnly`, `secure`, `SameSite=Lax` cookie
- Protected admin routes (authentication + role)
- All input validated with Zod
- CSRF protection through `Origin` header checks
- Rate limiting (login, messages, tracking)
- Security headers (Helmet)
- Uploads: type checked on the real file content, random names, size limits
- Secrets only in environment variables, never in the code

## Project structure

```text
portfolio/
├── backend/
│   ├── prisma/          database schema and migrations
│   ├── routes/          REST API (projects, content, messages, auth, admin…)
│   ├── middleware/      authentication
│   ├── scripts/         admin creation, data export/import
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── admin/       admin pages
        ├── components/  site sections
        ├── hooks/       data loading (cache, automatic retries)
        ├── i18n/        FR/EN translations
        └── pages/
```

## Running locally

Requirements: Node.js 22+ and PostgreSQL.

```bash
git clone https://github.com/Nobrittel/portfolio.git
cd portfolio
```

**1. Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db
JWT_SECRET=a_long_random_string_of_at_least_32_characters
CLIENT_URL=http://localhost:5173
SITE_URL=http://localhost:5173

# Optional: without these 3 lines, files are stored on the local disk
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed            # starter data (optional)
npm run create-admin    # creates the admin account
npm run dev             # http://localhost:5000
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

The admin area is available at `/admin/login`.

## Deployment

| Service | Role | Main settings |
|---|---|---|
| Neon | PostgreSQL database | pooled connection string in `DATABASE_URL` |
| Render | Node API | root `backend`, build `npm install --include=dev && npx prisma generate`, start `npm start` |
| Netlify | React site | base `frontend`, build `npm run build`, redirects in `frontend/netlify.toml` |
| Cloudinary | Images and résumé | `CLOUDINARY_*` variables |

A monitor calls `/api/ping` every 5 minutes to keep Render's free plan from sleeping.

## Roadmap

Automated tests, technical blog, testimonials, analytics.

## Author

**Loïc NOUDEHOUENOU**, Full-Stack developer
[GitHub](https://github.com/Nobrittel) · [LinkedIn](https://www.linkedin.com/in/loicnoudehouenou/) · [Portfolio](https://loicnoudehouenou.netlify.app)
