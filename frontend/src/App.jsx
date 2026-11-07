import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsProvider'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Tracker from './Tracker'
import AuthLayout from './admin/AuthLayout'
import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import RequireAuth from './admin/RequireAuth'
import Dashboard from './admin/Dashboard'
import AdminProjects from './admin/AdminProjects'
import ProjectForm from './admin/ProjectForm'
import AdminSkills from './admin/AdminSkills'
import AdminExperiences from './admin/AdminExperiences'
import AdminEducations from './admin/AdminEducations'
import AdminServices from './admin/AdminServices'
import AdminMessages from './admin/AdminMessages'
import AdminLinks from './admin/AdminLinks'
import AdminSettings from './admin/AdminSettings'

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
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

          <Route path="/admin" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/new" element={<ProjectForm />} />
                <Route path="projects/:id/edit" element={<ProjectForm />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="experiences" element={<AdminExperiences />} />
                <Route path="educations" element={<AdminEducations />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="links" element={<AdminLinks />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}

export default App