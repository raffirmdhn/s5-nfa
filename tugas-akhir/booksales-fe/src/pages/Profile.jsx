import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Shield, BookOpen, LogOut, ArrowRight, Calendar } from 'lucide-react'

export default function Profile() {
  const { user, isAdmin, logout } = useAuth()

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-obsidian">Profil Pengguna</h1>
        <p className="text-xs text-stone mt-1">
          Informasi akun dan pengaturan hak akses Anda di BookSales.
        </p>
      </div>

      <div className="bg-pure-white rounded-lg border border-hairline shadow-xs overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 border-b border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-obsidian text-pure-white flex items-center justify-center font-mono text-xl font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-obsidian">{user?.name || 'Pengguna'}</h2>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isAdmin
                      ? 'bg-obsidian text-pure-white border-obsidian'
                      : 'bg-paper-white text-charcoal border-hairline'
                  }`}
                >
                  {user?.role || 'customer'}
                </span>
              </div>
              <p className="text-xs text-stone mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
          >
            <LogOut size={13} />
            <span>Keluar Akun</span>
          </button>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <div className="text-stone font-mono uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
              <User size={13} />
              <span>Nama Lengkap</span>
            </div>
            <div className="font-medium text-obsidian text-sm">{user?.name || '-'}</div>
          </div>

          <div>
            <div className="text-stone font-mono uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
              <Mail size={13} />
              <span>Alamat Email</span>
            </div>
            <div className="font-medium text-obsidian text-sm">{user?.email || '-'}</div>
          </div>

          <div>
            <div className="text-stone font-mono uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
              <Shield size={13} />
              <span>Hak Akses (Role)</span>
            </div>
            <div className="font-medium text-obsidian capitalize text-sm">
              {user?.role || 'customer'}
            </div>
          </div>

          <div>
            <div className="text-stone font-mono uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
              <Calendar size={13} />
              <span>Terdaftar Sejak</span>
            </div>
            <div className="font-medium text-obsidian text-sm">
              {formatDate(user?.created_at || new Date().toISOString())}
            </div>
          </div>
        </div>

        {/* Action Panel Based on Role */}
        <div className="p-6 bg-paper-white/50 border-t border-hairline">
          <div className="text-xs font-semibold text-obsidian mb-2">Navigasi Berdasarkan Peran</div>
          {isAdmin ? (
            <div>
              <p className="text-xs text-stone mb-4">
                Sebagai <strong>Administrator</strong>, Anda memiliki izin penuh untuk mengelola master data Genre, Penulis, dan Buku.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors"
                >
                  <span>Buka Admin Dashboard</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  to="/admin/genres"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-pure-white text-obsidian border border-hairline hover:border-smoke rounded-md transition-colors"
                >
                  <span>Kelola Genre</span>
                </Link>
                <Link
                  to="/admin/authors"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-pure-white text-obsidian border border-hairline hover:border-smoke rounded-md transition-colors"
                >
                  <span>Kelola Penulis</span>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-stone mb-4">
                Sebagai <strong>Pengguna (Customer)</strong>, Anda dapat menjelajahi seluruh koleksi buku pada katalog kami.
              </p>
              <Link
                to="/books"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors"
              >
                <BookOpen size={13} />
                <span>Jelajahi Katalog Buku</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

