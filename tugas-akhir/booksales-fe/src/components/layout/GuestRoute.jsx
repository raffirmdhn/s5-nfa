import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function GuestRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-white text-stone text-sm">
        Memuat...
      </div>
    )
  }

  if (isAuthenticated) {
    // If already logged in, redirect away from guest-only pages
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/profile'} replace />
  }

  return children
}

