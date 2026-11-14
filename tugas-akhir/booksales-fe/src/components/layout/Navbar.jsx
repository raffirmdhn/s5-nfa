import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShieldCheck, LogIn, UserPlus, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <header className="sticky top-0 z-40 bg-pure-white/90 backdrop-blur-md border-b border-hairline w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-obsidian font-semibold tracking-tight text-sm">
            <span className="text-base">▲</span>
            <span>BookSales</span>
          </Link>
          <nav className="flex items-center gap-1 text-xs">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isActive('/') ? 'text-obsidian bg-hairline/60 font-medium' : 'text-stone hover:text-obsidian'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/books"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isActive('/books') ? 'text-obsidian bg-hairline/60 font-medium' : 'text-stone hover:text-obsidian'
              }`}
            >
              Katalog Buku
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-paper-white text-obsidian border border-hairline hover:border-smoke rounded-md transition-colors shadow-xs"
            >
              <ShieldCheck size={14} className="text-terminal-green" />
              <span>Admin Panel</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-hairline">
              <Link
                to="/profile"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                  isActive('/profile')
                    ? 'bg-hairline/70 text-obsidian font-medium'
                    : 'text-charcoal hover:text-obsidian hover:bg-hairline/40'
                }`}
                title="Profil Pengguna"
              >
                <User size={13} />
                <span className="hidden sm:inline font-mono">{user?.name || user?.email}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Keluar"
                className="p-1.5 text-stone hover:text-obsidian rounded-md hover:bg-hairline/50 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : !isAuthPage ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-charcoal hover:text-obsidian hover:bg-hairline/50 rounded-md transition-colors"
              >
                <LogIn size={13} />
                <span>Masuk</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors shadow-xs"
              >
                <UserPlus size={13} />
                <span>Daftar</span>
              </Link>
            </div>
          ) : (
            <Link
              to={location.pathname === '/login' ? '/register' : '/login'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-charcoal hover:text-obsidian hover:bg-hairline/50 rounded-md transition-colors"
            >
              {location.pathname === '/login' ? 'Daftar Akun' : 'Masuk Akun'}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
