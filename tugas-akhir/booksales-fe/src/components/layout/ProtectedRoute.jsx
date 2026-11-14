import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, requireAdmin = true }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-white text-stone text-sm">
        Memeriksa sesi...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper-white p-6 text-center">
        <h1 className="text-xl font-semibold text-obsidian mb-2">Akses Ditolak</h1>
        <p className="text-stone text-sm max-w-md mb-6">
          Akun Anda tidak memiliki hak akses administrator. Silakan masuk menggunakan akun admin.
        </p>
        <a
          href="/login"
          className="inline-flex items-center px-4 py-2 bg-obsidian text-pure-white text-xs font-medium rounded-md hover:bg-carbon transition-colors"
        >
          Masuk sebagai Admin
        </a>
      </div>
    )
  }

  return children
}

