import { prisma } from '../lib/prisma.js'

// ---------- Catégories ----------
const categories = [
  { slug: 'frontend', nameFr: 'Frontend', nameEn: 'Frontend' },
  { slug: 'backend', nameFr: 'Backend', nameEn: 'Backend' },
  { slug: 'fullstack', nameFr: 'Full-Stack', nameEn: 'Full-Stack' },
  { slug: 'api', nameFr: 'API', nameEn: 'API' },
  { slug: 'academic', nameFr: 'Académique', nameEn: 'Academic' },
]

// ---------- Projets (À MODIFIER : descriptions, technologies, liens) ----------
const projects = [
  {
    slug: 'time-teach',
    category: 'fullstack',
    technologies: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
    featured: true,
    titleFr: 'Time Teach',
    titleEn: 'Time Teach',
    shortDescFr: "Application web de gestion du temps d'enseignement : planification des cours et suivi des horaires.",
    shortDescEn: 'Web application for managing teaching time: course scheduling and timetable tracking.',
  },
  {
    slug: 'api-de-gestion',
    category: 'api',
    technologies: ['Node.js', 'Express', 'MySQL'],
    featured: true,
    titleFr: 'API de gestion',
    titleEn: 'Management API',
    shortDescFr: 'API REST sécurisée pour gérer des données : routes protégées, authentification et accès à la base de données.',
    shortDescEn: 'Secure REST API for managing data: protected routes, authentication and database access.',
  },
  {
    slug: 'site-vitrine',
    category: 'frontend',
    technologies: ['React', 'Tailwind CSS'],
    featured: true,
    titleFr: 'Site vitrine',
    titleEn: 'Showcase website',
    shortDescFr: 'Site vitrine responsive pour présenter une activité ou une entreprise.',
    shortDescEn: 'Responsive showcase website presenting a business or an activity.',
  },
  {
    slug: 'site-salle-de-sport',
    category: 'fullstack',
    technologies: ['PHP', 'MySQL', 'Bootstrap'],
    featured: false,
    titleFr: 'Site pour salle de sport',
    titleEn: 'Gym website',
    shortDescFr: 'Site web pour une salle de sport : présentation des activités, des abonnements et contact.',
    shortDescEn: 'Website for a gym: presentation of activities, memberships and contact.',
  },
  {
    slug: 'site-cooperative',
    category: 'fullstack',
    technologies: ['PHP', 'MySQL', 'Bootstrap'],
    featured: false,
    titleFr: 'Site pour coopérative',
    titleEn: 'Cooperative website',
    shortDescFr: "Site web pour une coopérative : présentation de l'organisation, de ses activités et de ses membres.",
    shortDescEn: 'Website for a cooperative: presentation of the organization, its activities and its members.',
  },
  {
    slug: 'gestion-de-rendez-vous',
    category: 'fullstack',
    technologies: ['PHP', 'MySQL', 'JavaScript'],
    featured: false,
    titleFr: 'Gestion de rendez-vous',
    titleEn: 'Appointment management',
    shortDescFr: 'Application web de prise et de gestion de rendez-vous : réservation en ligne, suivi et organisation du planning.',
    shortDescEn: 'Web application for booking and managing appointments: online booking, tracking and schedule organization.',
  },
]

// ---------- Compétences ----------
const skillGroups = {
  frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Bootstrap', 'Tailwind CSS'],
  backend: ['Node.js', 'Express.js', 'PHP', 'Laravel', 'API REST'],
  database: ['MySQL', 'PostgreSQL', 'MongoDB'],
  tools: ['Git', 'GitHub', 'VS Code', 'Postman'],
  methods: ['Agile', 'Scrum', 'UML'],
}

// ---------- Expériences ----------
const experiences = [
  {
    positionFr: 'Formateur en Informatique',
    positionEn: 'IT Trainer',
    company: 'Solidarité Alodo de Savalou',
    location: 'Savalou',
    periodFr: 'Année académique 2025–2026',
    periodEn: 'Academic year 2025–2026',
    missionsFr: [
      "Formation d'enseignants du primaire aux outils numériques avec des approches pédagogiques adaptées.",
      'Modules de formation progressifs pour un public non technique.',
      'Animation de séances interactives favorisant la participation active.',
    ],
    missionsEn: [
      'Training primary school teachers in digital tools using adapted teaching approaches.',
      'Progressive training modules for a non-technical audience.',
      'Leading interactive sessions that encourage active participation.',
    ],
    tagsFr: ['Formation', 'Pédagogie', 'Outils numériques'],
    tagsEn: ['Training', 'Teaching methods', 'Digital tools'],
  },
  {
    positionFr: 'Formateur en Informatique',
    positionEn: 'IT Trainer',
    company: 'MAFLYT SARL (partenariat Ministère MEMP)',
    location: null,
    periodFr: 'Année académique 2024–2025',
    periodEn: 'Academic year 2024–2025',
    missionsFr: [
      "Formation d'enseignants du primaire aux outils numériques avec des approches pédagogiques adaptées.",
      'Modules de formation progressifs pour un public non technique.',
      'Animation de séances interactives favorisant la participation active.',
    ],
    missionsEn: [
      'Training primary school teachers in digital tools using adapted teaching approaches.',
      'Progressive training modules for a non-technical audience.',
      'Leading interactive sessions that encourage active participation.',
    ],
    tagsFr: ['Formation', 'Pédagogie', 'Outils numériques'],
    tagsEn: ['Training', 'Teaching methods', 'Digital tools'],
  },
  {
    positionFr: 'Gestionnaire de Salle Numérique',
    positionEn: 'Digital Room Manager',
    company: 'EUPHORBIA GROUP (ASIN)',
    location: 'Nikki',
    periodFr: 'Année académique 2024–2025',
    periodEn: 'Academic year 2024–2025',
    missionsFr: [
      "Encadrement quotidien d'élèves et d'enseignants dans l'usage des outils numériques.",
      'Gestion du matériel informatique et animation de séances de sensibilisation.',
      "Création d'un environnement numérique sécurisé et stimulant pour les jeunes apprenants.",
    ],
    missionsEn: [
      'Day-to-day support of students and teachers in using digital tools.',
      'Management of IT equipment and awareness-raising sessions.',
      'Creation of a safe and stimulating digital environment for young learners.',
    ],
    tagsFr: ['Gestion de matériel', 'Sensibilisation', 'Encadrement'],
    tagsEn: ['Equipment management', 'Awareness', 'Mentoring'],
  },
  {
    positionFr: 'Technicien Informatique',
    positionEn: 'IT Technician',
    company: '7ème Colloque Scientifique International, Université de Parakou',
    location: 'Parakou',
    periodFr: 'Septembre 2024',
    periodEn: 'September 2024',
    missionsFr: [
      'Installation et configuration rapide de postes de travail pour intervenants.',
      "Diagnostic et résolution immédiate d'incidents matériels et logiciels en temps réel.",
    ],
    missionsEn: [
      'Fast installation and configuration of workstations for speakers.',
      'Immediate diagnosis and resolution of hardware and software incidents in real time.',
    ],
    tagsFr: ['Maintenance', 'Support technique'],
    tagsEn: ['Maintenance', 'Technical support'],
  },
  {
    positionFr: 'Stagiaire',
    positionEn: 'Intern',
    company: 'SPTIC, Université de Parakou',
    location: 'Parakou',
    periodFr: 'Mai – Août 2024',
    periodEn: 'May – August 2024',
    missionsFr: [
      "Développement web : création et maintenance d'applications.",
      'Support utilisateurs, configuration de postes et maintenance applicative.',
    ],
    missionsEn: [
      'Web development: building and maintaining applications.',
      'User support, workstation configuration and application maintenance.',
    ],
    tagsFr: ['Développement web', 'Support', 'Maintenance'],
    tagsEn: ['Web development', 'Support', 'Maintenance'],
  },
  {
    positionFr: 'Tuteur en Informatique',
    positionEn: 'IT Tutor',
    company: 'Complexe Scolaire Privé « La Relève »',
    location: 'Parakou',
    periodFr: 'Avril – Mai 2024 et Juin – Juillet 2023',
    periodEn: 'April – May 2024 and June – July 2023',
    missionsFr: [
      "Cours d'initiation à l'informatique pour élèves débutants (bureautique, Internet).",
      "Animation d'ateliers pratiques avec une approche ludique et participative.",
      'Élaboration de modules pédagogiques progressifs et évaluation des apprenants.',
    ],
    missionsEn: [
      'Introductory IT courses for beginner students (office software, Internet).',
      'Hands-on workshops with a playful, participatory approach.',
      'Design of progressive teaching modules and assessment of learners.',
    ],
    tagsFr: ['Enseignement', 'Bureautique', 'Pédagogie'],
    tagsEn: ['Teaching', 'Office software', 'Teaching methods'],
  },
  {
    positionFr: 'Stagiaire',
    positionEn: 'Intern',
    company: 'EASYSOFT Company',
    location: 'Cotonou',
    periodFr: 'Août – Septembre 2023',
    periodEn: 'August – September 2023',
    missionsFr: [
      'Développement web frontend et backend.',
      'Dépannage matériel et applicatif, support clients.',
    ],
    missionsEn: [
      'Frontend and backend web development.',
      'Hardware and software troubleshooting, customer support.',
    ],
    tagsFr: ['Frontend', 'Backend', 'Support client'],
    tagsEn: ['Frontend', 'Backend', 'Customer support'],
  },
]

// ---------- Formations ----------
const educations = [
  {
    diplomaFr: "Master 2 en Génie Logiciel et Intégration d'Application",
    diplomaEn: "Master's degree (Master 2) in Software Engineering and Application Integration",
    institution: 'Université de Parakou',
    periodFr: 'En cours',
    periodEn: 'Ongoing',
    ongoing: true,
  },
  {
    diplomaFr: 'Licence Professionnelle en Informatique de Gestion',
    diplomaEn: "Professional Bachelor's degree in Business Computing",
    institution: 'Université de Parakou',
    periodFr: '2021 – 2024',
    periodEn: '2021 – 2024',
    ongoing: false,
  },
  {
    diplomaFr: 'Certificat Tita Digital Skills',
    diplomaEn: 'Tita Digital Skills Certificate',
    institution: 'Université de Parakou',
    periodFr: '2025',
    periodEn: '2025',
    ongoing: false,
  },
  {
    diplomaFr: 'Certificat en Maintenance Informatique et Réseaux',
    diplomaEn: 'Certificate in IT Maintenance and Networks',
    institution: 'Centre Tech Cohésion',
    periodFr: '2020',
    periodEn: '2020',
    ongoing: false,
  },
]

// ---------- Services (d'après ton cahier des charges) ----------
const services = [
  {
    titleFr: 'Développement Web',
    titleEn: 'Web Development',
    descriptionFr: "Création d'applications et plateformes Web.",
    descriptionEn: 'Design and development of web applications and platforms.',
  },
  {
    titleFr: 'Backend & API',
    titleEn: 'Backend & API',
    descriptionFr: 'Conception de services backend et API REST.',
    descriptionEn: 'Design of backend services and REST APIs.',
  },
  {
    titleFr: 'Maintenance informatique',
    titleEn: 'IT Maintenance',
    descriptionFr: "Installation, configuration et maintenance de systèmes informatiques.",
    descriptionEn: 'Installation, configuration and maintenance of IT systems.',
  },
  {
    titleFr: 'Accompagnement numérique',
    titleEn: 'Digital Support',
    descriptionFr: "Formation et accompagnement dans l'utilisation des outils informatiques.",
    descriptionEn: 'Training and support in the use of digital tools.',
  },
]

async function main() {
  console.log('Nettoyage des tables...')
  await prisma.projectImage.deleteMany()
  await prisma.project.deleteMany()
  await prisma.technology.deleteMany()
  await prisma.category.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.education.deleteMany()
  await prisma.service.deleteMany()

  console.log('Catégories...')
  await prisma.category.createMany({ data: categories })

  console.log('Projets...')
  for (const p of projects) {
    await prisma.project.create({
      data: {
        slug: p.slug,
        titleFr: p.titleFr,
        titleEn: p.titleEn,
        shortDescFr: p.shortDescFr,
        shortDescEn: p.shortDescEn,
        descriptionFr: p.shortDescFr,
        descriptionEn: p.shortDescEn,
        featured: p.featured,
        published: true,
        progress: 'done',
        category: { connect: { slug: p.category } },
        technologies: {
          connectOrCreate: p.technologies.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
      },
    })
  }

  console.log('Compétences...')
  const skills = []
  for (const [group, names] of Object.entries(skillGroups)) {
    names.forEach((name, index) => {
      skills.push({ name, group, sortOrder: index })
    })
  }
  await prisma.skill.createMany({ data: skills })

  console.log('Expériences...')
  await prisma.experience.createMany({
    data: experiences.map((exp, index) => ({ ...exp, sortOrder: index })),
  })

  console.log('Formations...')
  await prisma.education.createMany({
    data: educations.map((edu, index) => ({ ...edu, sortOrder: index })),
  })

  console.log('Services...')
  await prisma.service.createMany({
    data: services.map((s, index) => ({ ...s, sortOrder: index })),
  })

  console.log('Terminé : la base est remplie.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })