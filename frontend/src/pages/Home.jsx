import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Experiences from '../components/Experiences'
import Education from '../components/Education'
import Services from '../components/Services'
import Contact from '../components/Contact'
import Reveal from '../components/Reveal'
import { useSettings } from '../context/settings'
import { useSeo } from '../seo'

// Titre et description de l'accueil dans chaque langue
const seoTexts = {
  fr: {
    title: 'Loïc Noudehouenou - Développeur Full-Stack',
    description:
      'Portfolio de Loïc Noudehouenou, développeur Full-Stack et formateur en informatique : projets web, API et applications avec JavaScript, React et Node.js.',
    jobTitle: 'Développeur Full-Stack',
  },
  en: {
    title: 'Loïc Noudehouenou -Full-Stack Developer',
    description:
      'Portfolio of Loïc Noudehouenou, Full-Stack developer and IT trainer: web projects, APIs and applications built with JavaScript, React and Node.js.',
    jobTitle: 'Full-Stack Developer',
  },
}

function Home() {
  const { lang } = useSettings()
  const texts = seoTexts[lang] ?? seoTexts.fr

  useSeo({
    title: texts.title,
    description: texts.description,
    lang,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Loïc Noudehouenou',
      jobTitle: texts.jobTitle,
      url: window.location.origin,
      sameAs: [
        'https://github.com/Nobrittel',
        'https://www.linkedin.com/in/loicnoudehouenou/',
      ],
    },
  })

  return (
    <div className="bg-page text-fg">
      <Navbar />
      <Hero />
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Skills />
      </Reveal>
      <Reveal>
        <Projects />
      </Reveal>
      <Reveal>
        <Experiences />
      </Reveal>
      <Reveal>
        <Education />
      </Reveal>
      <Reveal>
        <Services />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
    </div>
  )
}

export default Home