import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsProvider'
import ErrorBoundary from './ErrorBoundary'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Tracker from './Tracker'

// Ces deux morceaux ne sont téléchargés qu'au moment où on en a besoin
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const AdminRoutes = lazy(() => import('./admin/AdminRoutes'))

// Petit rond qui tourne pendant le téléchargement (sans texte, donc valable dans les deux langues)
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page">
      <div
        role="status"
        aria-label="Loading"
        className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-accent"
      ></div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Tracker />
                    <Home />
                  </>
                }
              />

              <Route
                path="/projets/:slug"
                element={
                  <>
                    <Tracker />
                    <ProjectDetail />
                  </>
                }
              />

              <Route path="/admin/*" element={<AdminRoutes />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SettingsProvider>
    </ErrorBoundary>
  )
}

export default App