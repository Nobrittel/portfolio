import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/auth'

// "soon" = page pas encore construite : affichée en grisé, sans lien
const LINKS = [
  { to: '/admin/projects', label: 'Projets' },
  { to: '/admin/skills', label: 'Compétences' },
  { label: 'Expériences', soon: true },
  { to: '/admin/educations', label: 'Formations' },
  { to: '/admin/messages', label: 'Messages reçus' },
  { to: '/admin/links', label: 'Clics sur les liens' },
]

function AdminLayout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-page text-fg">
      {/* Fond sombre derrière le menu sur mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Colonne de gauche : liens d'action */}
      <aside
        className={
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-line bg-surface transition-transform md:static md:translate-x-0 ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
      >
        <Link
          to="/admin/dashboard"
          onClick={() => setOpen(false)}
          className="flex h-14 items-center border-b border-line px-5 text-lg font-bold hover:text-accent"
        >
          Tableau de bord
        </Link>

        <nav className="flex-1 space-y-1 p-3">
          {LINKS.map((link) =>
            link.to ? (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  'block rounded-lg px-3 py-2 text-sm font-medium ' +
                  (isActive ? 'bg-accent/15 text-accent' : 'text-body hover:bg-chip')
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <div
                key={link.label}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted"
              >
                {link.label}
                <span className="rounded-full bg-chip px-2 py-0.5 text-xs">bientôt</span>
              </div>
            )
          )}
        </nav>

        <div className="border-t border-line p-3">
          <Link to="/" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-chip">
            ← Voir le site
          </Link>
        </div>
      </aside>

      {/* Zone de droite : en-tête + contenu */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="grid h-14 grid-cols-3 items-center border-b border-line bg-surface px-4">
          {/* Gauche : bouton menu (mobile seulement) */}
          <div>
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg border border-line px-3 py-1 md:hidden"
              aria-label="Ouvrir le menu"
            >
              ☰
            </button>
          </div>

          {/* Centre : nom */}
          <p className="truncate text-center font-semibold">{user?.name}</p>

          {/* Droite : déconnexion en rouge */}
          <div className="flex justify-end">
            <button
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Statistiques et pages : centrées */}
        <main className="flex-1 p-6">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout