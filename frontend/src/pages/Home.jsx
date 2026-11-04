import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Experiences from '../components/Experiences'
import Education from '../components/Education'
import Contact from '../components/Contact'
import Reveal from '../components/Reveal'

function Home() {
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
        <Contact />
      </Reveal>
    </div>
  )
}

export default Home