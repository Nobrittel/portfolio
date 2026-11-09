import { Navigate, Route, Routes } from 'react-router-dom'
import NotFound from '../pages/NotFound'
import AuthLayout from './AuthLayout'
import AdminLayout from './AdminLayout'
import Login from './Login'
import RequireAuth from './RequireAuth'
import Dashboard from './Dashboard'
import AdminProjects from './AdminProjects'
import ProjectForm from './ProjectForm'
import AdminSkills from './AdminSkills'
import AdminExperiences from './AdminExperiences'
import AdminEducations from './AdminEducations'
import AdminServices from './AdminServices'
import AdminMessages from './AdminMessages'
import AdminLinks from './AdminLinks'
import AdminSettings from './AdminSettings'

// Toutes les routes sous /admin. Ce fichier n'est téléchargé que par l'administrateur.
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
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
  )
}