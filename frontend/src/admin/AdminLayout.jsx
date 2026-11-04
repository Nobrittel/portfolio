import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/auth'

function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-page text-fg">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link to="/admin/dashboard" className="text-lg font-bold">
            Administration <span className="text-accent">Portfolio</span>
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link to="/" className="text-body transition hover:text-accent">
              Voir le site
            </Link>
            <span className="text-muted">{user?.email}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-line px-4 py-2 font-semibold transition hover:border-accent hover:text-accent"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout