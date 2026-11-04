import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'

// Le contexte de connexion n'existe que dans /admin : les visiteurs du site
// public ne déclenchent aucune requête d'authentification.
function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export default AuthLayout