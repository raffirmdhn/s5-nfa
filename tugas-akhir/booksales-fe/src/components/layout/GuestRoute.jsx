import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function GuestRoute({ children }) {
  const { isAuthenticated, isAdmin, initialLoading } = useAuth()
  const [searchParams] = useSearchParams()

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-white text-stone text-sm">
        Memuat...
      </div>
    )
  }

  if (isAuthenticated) {
    const redirectTo = searchParams.get('redirectto')
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }

    return <Navigate to={isAdmin ? '/admin/dashboard' : '/books'} replace />
  }

  return children
}
