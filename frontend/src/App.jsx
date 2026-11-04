import AdminProjects from './admin/AdminProjects'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsProvider'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import AuthLayout from './admin/AuthLayout'
import Login from './admin/Login'
import RequireAuth from './admin/RequireAuth'
import Dashboard from './admin/Dashboard'


function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/admin" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<AdminProjects />} />
            </Route>
          </Route>

          <Route element={<RequireAuth />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<AdminProjects />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}

export default App