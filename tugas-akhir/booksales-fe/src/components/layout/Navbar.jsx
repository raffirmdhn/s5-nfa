import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { ShieldCheck, LogIn, UserPlus, LogOut, User, ShoppingCart, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { getCartCount } = useCart()
  const location = useLocation()
  const cartCount = getCartCount()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Tutup mobile menu saat pindah rute
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path) => location.pathname === path
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <header className="sticky top-0 z-40 bg-pure-white/95 backdrop-blur-md border-b border-hairline w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand & Desktop Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-obsidian font-semibold tracking-tight text-sm"
          >
            <span className="text-base">▲</span>
            <span>BookSales</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isActive('/')
                  ? 'text-obsidian bg-hairline/60 font-medium'
                  : 'text-stone hover:text-obsidian'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/books"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isActive('/books')
                  ? 'text-obsidian bg-hairline/60 font-medium'
                  : 'text-stone hover:text-obsidian'
              }`}
            >
              Katalog Buku
            </Link>
          </nav>
        </div>

        {/* Right Actions: Cart, Auth & Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Icon (Always visible) */}
          <Link
            to="/cart"
            className={`relative p-2 rounded-md transition-colors ${
              isActive('/cart')
                ? 'bg-hairline/70 text-obsidian'
                : 'text-stone hover:text-obsidian hover:bg-hairline/40'
            }`}
            title="Keranjang Belanja"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-obsidian text-pure-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Desktop Only Actions */}
          <div className="hidden md:flex items-center gap-2">
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
                  <span className="font-mono">{user?.name || user?.email}</span>
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone hover:text-obsidian hover:bg-hairline/40 rounded-md transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-pure-white border-b border-hairline px-4 py-3 space-y-2 shadow-sm animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive('/') ? 'bg-paper-white text-obsidian' : 'text-stone hover:text-obsidian'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/books"
              className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive('/books')
                  ? 'bg-paper-white text-obsidian'
                  : 'text-stone hover:text-obsidian'
              }`}
            >
              Katalog Buku
            </Link>
          </div>

          <div className="pt-2 border-t border-hairline space-y-1.5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive('/profile')
                      ? 'bg-paper-white text-obsidian'
                      : 'text-stone hover:text-obsidian'
                  }`}
                >
                  <User size={14} />
                  <span>Profil ({user?.name || user?.email})</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-obsidian bg-paper-white border border-hairline"
                  >
                    <ShieldCheck size={14} className="text-terminal-green" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Keluar Akun</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-charcoal hover:text-obsidian bg-paper-white border border-hairline rounded-md transition-colors"
                >
                  <LogIn size={13} />
                  <span>Masuk</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors"
                >
                  <UserPlus size={13} />
                  <span>Daftar</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
