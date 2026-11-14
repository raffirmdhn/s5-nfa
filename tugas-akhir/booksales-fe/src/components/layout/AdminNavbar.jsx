import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Bookmark, Users, LayoutDashboard, ExternalLink, LogOut } from 'lucide-react'

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Genre', path: '/admin/genres', icon: Bookmark },
    { label: 'Penulis', path: '/admin/authors', icon: Users },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 bg-pure-white border-b border-hairline w-full">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-obsidian font-semibold tracking-tight text-sm">
            <span>▲</span>
            <span>BookSales</span>
          </Link>
          <span className="text-ash font-mono text-xs">/</span>
          <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 bg-paper-white text-stone border border-hairline rounded">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-charcoal hover:text-obsidian hover:bg-hairline/40 rounded-md transition-colors"
          >
            <span>Lihat Toko</span>
            <ExternalLink size={12} />
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-hairline">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-obsidian">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-stone font-mono">{user?.email}</div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Keluar Akun"
              className="p-1.5 text-stone hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-1 border-t border-hairline/50 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`inline-flex items-center gap-2 py-2.5 px-3 text-xs border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'border-obsidian text-obsidian font-semibold'
                  : 'border-transparent text-stone hover:text-charcoal hover:border-smoke'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </header>
  )
}
