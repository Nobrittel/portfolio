import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/auth'

const LINKS = [
  { to: '/admin/dashboard', label: 'Tableau de bord' },
  { to: '/admin/projects', label: 'Projets' },
  { to: '/admin/skills', label: 'Compétences' },
]

function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <nav className="flex flex-wrap items-center gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  'rounded-lg px-3 py-1.5 text-sm font-medium ' +
                  (isActive
                    ? 'bg-accent/15 text-accent'
                    : 'text-body hover:bg-chip')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-muted hover:underline">
              Voir le site
            </Link>
            {user && <span className="text-muted">{user.name}</span>}
            <button
              onClick={logout}
              className="rounded-lg border border-line px-3 py-1.5 hover:bg-chip"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout