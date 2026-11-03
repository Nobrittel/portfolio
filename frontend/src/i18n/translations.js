export const translations = {
  fr: {
    meta: { title: 'Loïc Noudehouenou | Développeur Full-Stack' },

    nav: {
      home: 'Accueil',
      about: 'À propos',
      skills: 'Compétences',
      projects: 'Projets',
      career: 'Parcours',
      contact: 'Contact',
      toggleTheme: 'Changer de thème',
      openMenu: 'Ouvrir le menu',
      language: 'Langue',
    },

    hero: {
      available: 'Disponible pour de nouveaux projets',
      greeting: 'Bonjour, je suis',
      roles: [
        'Développeur Full-Stack',
        'Formateur en informatique',
        "Créateur d'applications Web",
      ],
      intro:
        "Je conçois et développe des applications Web modernes, performantes et adaptées aux besoins des utilisateurs.",
      seeProjects: 'Découvrir mes projets',
      contactMe: 'Me contacter',
      photoAlt: 'Portrait de Loïc Noudehouenou',
    },

    about: {
      title: 'À propos',
      p1: "Je suis développeur Full-Stack et formateur en informatique. Je construis des applications Web modernes avec JavaScript, React, Node.js et MySQL, et je sais expliquer la technique à un public qui n'est pas technicien.",
      p2: "Cette expérience de la formation, auprès d'enseignants et d'élèves, m'aide à concevoir des outils clairs et faciles à utiliser. Je prépare actuellement un Master 2 en Génie Logiciel et Intégration d'Application.",
      stats: [
        { to: 7, suffix: '', label: 'Projets' },
        { to: 3, suffix: ' ans', label: "D'expérience" },
        { to: 15, suffix: '+', label: 'Technologies' },
      ],
    },

    skills: {
      title: 'Compétences',
      groups: {
        frontend: 'Frontend',
        backend: 'Backend',
        database: 'Base de données',
        tools: 'Outils',
        methods: 'Méthodologies',
      },
    },

    projects: {
      title: 'Projets',
      searchPlaceholder: 'Rechercher un projet...',
      categories: {
        all: 'Tous',
        frontend: 'Frontend',
        backend: 'Backend',
        fullstack: 'Full-Stack',
        api: 'API',
        academic: 'Académique',
      },
      status: { done: 'Terminé', ongoing: 'En cours' },
      demo: 'Démo',
      github: 'GitHub',
      empty: 'Aucun projet ne correspond à ta recherche.',
      count: (n) => n + ' projet' + (n > 1 ? 's' : '') + ' affiché' + (n > 1 ? 's' : ''),
      // À MODIFIER : remplace les descriptions par les tiennes
      items: {
        timeteach: {
          title: 'Time Teach',
          description:
            "Application web de gestion du temps d'enseignement : planification des cours et suivi des horaires.",
        },
        api: {
          title: 'API de gestion',
          description:
            "API REST sécurisée pour gérer des données : routes protégées, authentification et accès à la base de données.",
        },
        showcase: {
          title: 'Site vitrine',
          description:
            "Site vitrine responsive pour présenter une activité ou une entreprise.",
        },
        gym: {
          title: 'Site pour salle de sport',
          description:
            "Site web pour une salle de sport : présentation des activités, des abonnements et contact.",
        },
        coop: {
          title: 'Site pour coopérative',
          description:
            "Site web pour une coopérative : présentation de l'organisation, de ses activités et de ses membres.",
        },
        appointments: {
          title: 'Gestion de rendez-vous',
          description:
            "Application web de prise et de gestion de rendez-vous : réservation en ligne, suivi et organisation du planning.",
        },
      },
    },

    experience: {
      title: 'Expériences',
      items: [
        {
          id: 1,
          position: 'Formateur en Informatique',
          company: 'Solidarité Alodo de Savalou',
          location: 'Savalou',
          period: 'Année académique 2025–2026',
          missions: [
            "Formation d'enseignants du primaire aux outils numériques avec des approches pédagogiques adaptées.",
            'Modules de formation progressifs pour un public non technique.',
            'Animation de séances interactives favorisant la participation active.',
          ],
          tags: ['Formation', 'Pédagogie', 'Outils numériques'],
        },
        {
          id: 2,
          position: 'Formateur en Informatique',
          company: 'MAFLYT SARL (partenariat Ministère MEMP)',
          location: '',
          period: 'Année académique 2024–2025',
          missions: [
            "Formation d'enseignants du primaire aux outils numériques avec des approches pédagogiques adaptées.",
            'Modules de formation progressifs pour un public non technique.',
            'Animation de séances interactives favorisant la participation active.',
          ],
          tags: ['Formation', 'Pédagogie', 'Outils numériques'],
        },
        {
          id: 3,
          position: 'Gestionnaire de Salle Numérique',
          company: 'EUPHORBIA GROUP (ASIN)',
          location: 'Nikki',
          period: 'Année académique 2024–2025',
          missions: [
            "Encadrement quotidien d'élèves et d'enseignants dans l'usage des outils numériques.",
            'Gestion du matériel informatique et animation de séances de sensibilisation.',
            "Création d'un environnement numérique sécurisé et stimulant pour les jeunes apprenants.",
          ],
          tags: ['Gestion de matériel', 'Sensibilisation', 'Encadrement'],
        },
        {
          id: 4,
          position: 'Technicien Informatique',
          company: '7ème Colloque Scientifique International, Université de Parakou',
          location: 'Parakou',
          period: 'Septembre 2024',
          missions: [
            'Installation et configuration rapide de postes de travail pour intervenants.',
            "Diagnostic et résolution immédiate d'incidents matériels et logiciels en temps réel.",
          ],
          tags: ['Maintenance', 'Support technique'],
        },
        {
          id: 5,
          position: 'Stagiaire',
          company: 'SPTIC, Université de Parakou',
          location: 'Parakou',
          period: 'Mai – Août 2024',
          missions: [
            "Développement web : création et maintenance d'applications.",
            'Support utilisateurs, configuration de postes et maintenance applicative.',
          ],
          tags: ['Développement web', 'Support', 'Maintenance'],
        },
        {
          id: 6,
          position: 'Tuteur en Informatique',
          company: 'Complexe Scolaire Privé « La Relève »',
          location: 'Parakou',
          period: 'Avril – Mai 2024 et Juin – Juillet 2023',
          missions: [
            "Cours d'initiation à l'informatique pour élèves débutants (bureautique, Internet).",
            "Animation d'ateliers pratiques avec une approche ludique et participative.",
            'Élaboration de modules pédagogiques progressifs et évaluation des apprenants.',
          ],
          tags: ['Enseignement', 'Bureautique', 'Pédagogie'],
        },
        {
          id: 7,
          position: 'Stagiaire',
          company: 'EASYSOFT Company',
          location: 'Cotonou',
          period: 'Août – Septembre 2023',
          missions: [
            'Développement web frontend et backend.',
            'Dépannage matériel et applicatif, support clients.',
          ],
          tags: ['Frontend', 'Backend', 'Support client'],
        },
      ],
    },

    education: {
      title: 'Formations',
      items: [
        {
          id: 1,
          diploma: "Master 2 en Génie Logiciel et Intégration d'Application",
          institution: 'Université de Parakou',
          period: 'En cours',
          ongoing: true,
        },
        {
          id: 2,
          diploma: 'Licence Professionnelle en Informatique de Gestion',
          institution: 'Université de Parakou',
          period: '2021 – 2024',
          ongoing: false,
        },
        {
          id: 3,
          diploma: 'Certificat Tita Digital Skills',
          institution: 'Université de Parakou',
          period: '2025',
          ongoing: false,
        },
        {
          id: 4,
          diploma: 'Certificat en Maintenance Informatique et Réseaux',
          institution: 'Centre Tech Cohésion',
          period: '2020',
          ongoing: false,
        },
      ],
    },

    contact: {
      title: 'Contact',
      intro:
        "Un projet, une question, une opportunité ? Écris-moi, je réponds rapidement.",
      name: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      success: "Message prêt. L'envoi réel sera activé avec le backend.",
      whatsapp: 'Discuter sur WhatsApp',
      cv: 'Télécharger mon CV',
    },
  },

  en: {
    meta: { title: 'Loïc Noudehouenou | Full-Stack Developer' },

    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      career: 'Career',
      contact: 'Contact',
      toggleTheme: 'Toggle theme',
      openMenu: 'Open menu',
      language: 'Language',
    },

    hero: {
      available: 'Available for new projects',
      greeting: "Hello, I'm",
      roles: ['Full-Stack Developer', 'IT Trainer', 'Web Application Builder'],
      intro:
        "I design and build modern, high-performing web applications tailored to users' needs.",
      seeProjects: 'View my projects',
      contactMe: 'Contact me',
      photoAlt: 'Portrait of Loïc Noudehouenou',
    },

    about: {
      title: 'About',
      p1: "I'm a Full-Stack developer and IT trainer. I build modern web applications with JavaScript, React, Node.js and MySQL, and I can explain technical topics to non-technical audiences.",
      p2: "This training experience, with teachers and students, helps me design tools that are clear and easy to use. I am currently pursuing a Master's degree (Master 2) in Software Engineering and Application Integration.",
      stats: [
        { to: 7, suffix: '', label: 'Projects' },
        { to: 3, suffix: ' years', label: 'Of experience' },
        { to: 15, suffix: '+', label: 'Technologies' },
      ],
    },

    skills: {
      title: 'Skills',
      groups: {
        frontend: 'Frontend',
        backend: 'Backend',
        database: 'Databases',
        tools: 'Tools',
        methods: 'Methodologies',
      },
    },

    projects: {
      title: 'Projects',
      searchPlaceholder: 'Search a project...',
      categories: {
        all: 'All',
        frontend: 'Frontend',
        backend: 'Backend',
        fullstack: 'Full-Stack',
        api: 'API',
        academic: 'Academic',
      },
      status: { done: 'Completed', ongoing: 'In progress' },
      demo: 'Demo',
      github: 'GitHub',
      empty: 'No project matches your search.',
      count: (n) => n + ' project' + (n !== 1 ? 's' : '') + ' shown',
      items: {
        timeteach: {
          title: 'Time Teach',
          description:
            'Web application for managing teaching time: course scheduling and timetable tracking.',
        },
        api: {
          title: 'Management API',
          description:
            'Secure REST API for managing data: protected routes, authentication and database access.',
        },
        showcase: {
          title: 'Showcase website',
          description:
            'Responsive showcase website presenting a business or an activity.',
        },
        gym: {
          title: 'Gym website',
          description:
            'Website for a gym: presentation of activities, memberships and contact.',
        },
        coop: {
          title: 'Cooperative website',
          description:
            'Website for a cooperative: presentation of the organization, its activities and its members.',
        },
        appointments: {
          title: 'Appointment management',
          description:
            'Web application for booking and managing appointments: online booking, tracking and schedule organization.',
        },
      },
    },

    experience: {
      title: 'Experience',
      items: [
        {
          id: 1,
          position: 'IT Trainer',
          company: 'Solidarité Alodo de Savalou',
          location: 'Savalou',
          period: 'Academic year 2025–2026',
          missions: [
            'Training primary school teachers in digital tools using adapted teaching approaches.',
            'Progressive training modules for a non-technical audience.',
            'Leading interactive sessions that encourage active participation.',
          ],
          tags: ['Training', 'Teaching methods', 'Digital tools'],
        },
        {
          id: 2,
          position: 'IT Trainer',
          company: 'MAFLYT SARL (partnership with the MEMP Ministry)',
          location: '',
          period: 'Academic year 2024–2025',
          missions: [
            'Training primary school teachers in digital tools using adapted teaching approaches.',
            'Progressive training modules for a non-technical audience.',
            'Leading interactive sessions that encourage active participation.',
          ],
          tags: ['Training', 'Teaching methods', 'Digital tools'],
        },
        {
          id: 3,
          position: 'Digital Room Manager',
          company: 'EUPHORBIA GROUP (ASIN)',
          location: 'Nikki',
          period: 'Academic year 2024–2025',
          missions: [
            'Day-to-day support of students and teachers in using digital tools.',
            'Management of IT equipment and awareness-raising sessions.',
            'Creation of a safe and stimulating digital environment for young learners.',
          ],
          tags: ['Equipment management', 'Awareness', 'Mentoring'],
        },
        {
          id: 4,
          position: 'IT Technician',
          company: '7th International Scientific Colloquium, University of Parakou',
          location: 'Parakou',
          period: 'September 2024',
          missions: [
            'Fast installation and configuration of workstations for speakers.',
            'Immediate diagnosis and resolution of hardware and software incidents in real time.',
          ],
          tags: ['Maintenance', 'Technical support'],
        },
        {
          id: 5,
          position: 'Intern',
          company: 'SPTIC, University of Parakou',
          location: 'Parakou',
          period: 'May – August 2024',
          missions: [
            'Web development: building and maintaining applications.',
            'User support, workstation configuration and application maintenance.',
          ],
          tags: ['Web development', 'Support', 'Maintenance'],
        },
        {
          id: 6,
          position: 'IT Tutor',
          company: 'Private school complex « La Relève »',
          location: 'Parakou',
          period: 'April – May 2024 and June – July 2023',
          missions: [
            'Introductory IT courses for beginner students (office software, Internet).',
            'Hands-on workshops with a playful, participatory approach.',
            'Design of progressive teaching modules and assessment of learners.',
          ],
          tags: ['Teaching', 'Office software', 'Teaching methods'],
        },
        {
          id: 7,
          position: 'Intern',
          company: 'EASYSOFT Company',
          location: 'Cotonou',
          period: 'August – September 2023',
          missions: [
            'Frontend and backend web development.',
            'Hardware and software troubleshooting, customer support.',
          ],
          tags: ['Frontend', 'Backend', 'Customer support'],
        },
      ],
    },

    education: {
      title: 'Education',
      items: [
        {
          id: 1,
          diploma: "Master's degree (Master 2) in Software Engineering and Application Integration",
          institution: 'University of Parakou',
          period: 'Ongoing',
          ongoing: true,
        },
        {
          id: 2,
          diploma: "Professional Bachelor's degree in Business Computing",
          institution: 'University of Parakou',
          period: '2021 – 2024',
          ongoing: false,
        },
        {
          id: 3,
          diploma: 'Tita Digital Skills Certificate',
          institution: 'University of Parakou',
          period: '2025',
          ongoing: false,
        },
        {
          id: 4,
          diploma: 'Certificate in IT Maintenance and Networks',
          institution: 'Centre Tech Cohésion',
          period: '2020',
          ongoing: false,
        },
      ],
    },

    contact: {
      title: 'Contact',
      intro:
        'A project, a question, an opportunity? Write to me, I reply quickly.',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      success: 'Message ready. Real sending will be enabled with the backend.',
      whatsapp: 'Chat on WhatsApp',
      cv: 'Download my CV',
    },
  },
}