import {
  SiAngular, SiApache, SiAxios, SiBootstrap, SiCloudinary, SiCss, SiDocker,
  SiExpress, SiFigma, SiFirebase, SiFlutter, SiFramer, SiGit, SiGithub,
  SiHtml5, SiJavascript, SiJest, SiJquery, SiJsonwebtokens, SiLaravel,
  SiLinux, SiMariadb, SiMongodb, SiMysql, SiNetlify, SiNextdotjs, SiNginx,
  SiNodedotjs, SiNpm, SiOpenjdk, SiPhp, SiPostgresql, SiPostman, SiPrisma,
  SiPython, SiReact, SiRedux, SiRender, SiSass, SiSqlite, SiSupabase,
  SiTailwindcss, SiTypescript, SiVercel, SiVite, SiVuedotjs, SiWordpress,
  SiZod,
} from 'react-icons/si'
import { useSettings } from '../context/settings'

// Clé = nom normalisé (minuscules, sans espaces, points ni tirets)
// color = couleur du logo ; dark = couleur en mode sombre ; sans color = couleur du texte
const ICONS = {
  html: { Icon: SiHtml5, color: '#E34F26' },
  html5: { Icon: SiHtml5, color: '#E34F26' },
  css: { Icon: SiCss, color: '#1572B6', dark: '#4C9BE0' },
  css3: { Icon: SiCss, color: '#1572B6', dark: '#4C9BE0' },
  javascript: { Icon: SiJavascript, color: '#CA8A04', dark: '#F7DF1E' },
  js: { Icon: SiJavascript, color: '#CA8A04', dark: '#F7DF1E' },
  typescript: { Icon: SiTypescript, color: '#3178C6' },
  ts: { Icon: SiTypescript, color: '#3178C6' },
  react: { Icon: SiReact, color: '#0891B2', dark: '#61DAFB' },
  reactjs: { Icon: SiReact, color: '#0891B2', dark: '#61DAFB' },
  redux: { Icon: SiRedux, color: '#764ABC', dark: '#A78BDA' },
  vite: { Icon: SiVite, color: '#646CFF' },
  tailwind: { Icon: SiTailwindcss, color: '#06B6D4' },
  tailwindcss: { Icon: SiTailwindcss, color: '#06B6D4' },
  bootstrap: { Icon: SiBootstrap, color: '#7952B3', dark: '#A78BDA' },
  framermotion: { Icon: SiFramer },
  jquery: { Icon: SiJquery, color: '#0769AD', dark: '#4C9BE0' },
  sass: { Icon: SiSass, color: '#CC6699' },
  vue: { Icon: SiVuedotjs, color: '#42B883' },
  vuejs: { Icon: SiVuedotjs, color: '#42B883' },
  angular: { Icon: SiAngular, color: '#DD0031' },
  nextjs: { Icon: SiNextdotjs },
  next: { Icon: SiNextdotjs },
  node: { Icon: SiNodedotjs, color: '#3C873A', dark: '#5FA04E' },
  nodejs: { Icon: SiNodedotjs, color: '#3C873A', dark: '#5FA04E' },
  express: { Icon: SiExpress },
  expressjs: { Icon: SiExpress },
  php: { Icon: SiPhp, color: '#777BB4', dark: '#9A9EDB' },
  laravel: { Icon: SiLaravel, color: '#FF2D20' },
  python: { Icon: SiPython, color: '#3776AB', dark: '#5B9BD5' },
  java: { Icon: SiOpenjdk, color: '#ED8B00' },
  flutter: { Icon: SiFlutter, color: '#02569B', dark: '#42A5F5' },
  wordpress: { Icon: SiWordpress, color: '#21759B', dark: '#4C9BE0' },
  prisma: { Icon: SiPrisma },
  mysql: { Icon: SiMysql, color: '#00758F', dark: '#4DA6C0' },
  postgresql: { Icon: SiPostgresql, color: '#336791', dark: '#6C9BE0' },
  postgres: { Icon: SiPostgresql, color: '#336791', dark: '#6C9BE0' },
  mariadb: { Icon: SiMariadb, color: '#003545', dark: '#4DA6C0' },
  sqlite: { Icon: SiSqlite, color: '#003B57', dark: '#4DA6C0' },
  mongodb: { Icon: SiMongodb, color: '#47A248' },
  supabase: { Icon: SiSupabase, color: '#3ECF8E' },
  firebase: { Icon: SiFirebase, color: '#DD2C00' },
  git: { Icon: SiGit, color: '#F05032' },
  github: { Icon: SiGithub },
  postman: { Icon: SiPostman, color: '#FF6C37' },
  docker: { Icon: SiDocker, color: '#2496ED' },
  npm: { Icon: SiNpm, color: '#CB3837' },
  linux: { Icon: SiLinux },
  nginx: { Icon: SiNginx, color: '#009639' },
  apache: { Icon: SiApache, color: '#D22128' },
  figma: { Icon: SiFigma, color: '#F24E1E' },
  jwt: { Icon: SiJsonwebtokens },
  zod: { Icon: SiZod, color: '#3E67B1', dark: '#6C9BE0' },
  axios: { Icon: SiAxios, color: '#5A29E4', dark: '#8F6BF0' },
  jest: { Icon: SiJest, color: '#C21325' },
  cloudinary: { Icon: SiCloudinary, color: '#3448C5', dark: '#6C7BE0' },
  netlify: { Icon: SiNetlify, color: '#00C7B7' },
  vercel: { Icon: SiVercel },
  render: { Icon: SiRender },
}

function normalize(name) {
  return String(name).toLowerCase().replace(/[\s.\-_/]/g, '')
}

// Logo seul. Renvoie null si la technologie n'est pas connue.
export function TechIcon({ name, className = 'h-4 w-4 shrink-0' }) {
  const { theme } = useSettings()
  const entry = ICONS[normalize(name)]
  if (!entry) return null

  const color = theme === 'dark' ? entry.dark || entry.color : entry.color
  return (
    <entry.Icon
      aria-hidden="true"
      className={className}
      style={color ? { color } : undefined}
    />
  )
}

// Logo + nom. Technologie inconnue : le nom seul s'affiche (rien ne casse).
export default function TechLabel({ name, className = '' }) {
  return (
    <span className={'inline-flex items-center gap-2 ' + className}>
      <TechIcon name={name} />
      {name}
    </span>
  )
}