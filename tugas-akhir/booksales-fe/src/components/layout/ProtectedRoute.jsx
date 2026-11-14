import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = null, requireAdmin = false }) {
  const { isAuthenticated, user, hasRole, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-white text-stone text-sm">
        Memuat...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role authorization
  let isAuthorized = true
  if (allowedRoles) {
    isAuthorized = hasRole(allowedRoles)
  } else if (requireAdmin) {
    isAuthorized = isAdmin
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper-white p-6 text-center">
        <h1 className="text-xl font-semibold text-obsidian mb-2">Halaman Tidak Tersedia</h1>
        <p className="text-stone text-sm max-w-md mb-6">
          Anda tidak memiliki izin untuk melihat halaman ini.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-obsidian text-pure-white text-xs font-medium rounded-md hover:bg-carbon transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    )
  }

  return children
}
