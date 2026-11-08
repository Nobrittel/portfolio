// Textes de l'interface. Les projets, compétences, expériences, formations
// et services viennent de la base de données (via l'API).
export const translations = {
  fr: {
    meta: { title: 'Loïc Noudehouenou | Développeur Full-Stack' },

    common: {
      loading: 'Chargement...',
      error: "Impossible de charger les données. Vérifie que le serveur est lancé.",
    },

    nav: {
      home: 'Accueil',
      about: 'À propos',
      skills: 'Compétences',
      projects: 'Projets',
      career: 'Parcours',
      services: 'Services',
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
        { key: 'projects', to: 6, suffix: '', label: 'Projets' },
        { to: 3, suffix: ' ans', label: "D'expérience" },
        { key: 'skills', to: 15, suffix: '+', label: 'Technologies' },
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
    },

    experience: { title: 'Expériences' },

    education: { title: 'Formations' },

    services: { title: 'Services' },

    contact: {
      title: 'Contact',
      intro:
        "Un projet, une question, une opportunité ? Écris-moi, je réponds rapidement.",
      name: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      message: 'Message',
      send: 'Envoyer',
      sending: 'Envoi en cours...',
      success: 'Message envoyé, merci ! Je te réponds bientôt.',
      error: "Le message n'a pas pu être envoyé. Vérifie les champs et réessaie.",
      whatsapp: 'Discuter sur WhatsApp',
      cv: 'Télécharger mon CV',
    },
  },

  en: {
    meta: { title: 'Loïc Noudehouenou | Full-Stack Developer' },

    common: {
      loading: 'Loading...',
      error: 'Unable to load the data. Check that the server is running.',
    },

    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      career: 'Career',
      services: 'Services',
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
        { key: 'projects', to: 6, suffix: '', label: 'Projects' },
        { to: 3, suffix: ' years', label: 'Of experience' },
        { key: 'skills', to: 15, suffix: '+', label: 'Technologies' },
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
    },

    experience: { title: 'Experience' },

    education: { title: 'Education' },

    services: { title: 'Services' },

    contact: {
      title: 'Contact',
      intro:
        'A project, a question, an opportunity? Write to me, I reply quickly.',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      success: "Message sent, thank you! I'll get back to you soon.",
      error: 'The message could not be sent. Check the fields and try again.',
      whatsapp: 'Chat on WhatsApp',
      cv: 'Download my CV',
    },
  },
}