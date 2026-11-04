import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsProvider'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import AuthLayout from './admin/AuthLayout'
import AdminLayout from './admin/AdminLayout'
import Login from './admin/Login'
import RequireAuth from './admin/RequireAuth'
import Dashboard from './admin/Dashboard'
import AdminProjects from './admin/AdminProjects'
import ProjectForm from './admin/ProjectForm'
import AdminSkills from './admin/AdminSkills'
import AdminMessages from './admin/AdminMessages'

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

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
                <Route path="messages" element={<AdminMessages />} />
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