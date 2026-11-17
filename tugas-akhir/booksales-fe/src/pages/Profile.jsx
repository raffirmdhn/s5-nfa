import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import transactionService from '../services/transactionService'
import BookCover from '../components/common/BookCover'
import TransactionDetailModal from '../components/common/TransactionDetailModal'
import {
  User,
  Mail,
  Shield,
  BookOpen,
  LogOut,
  ArrowRight,
  Calendar,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  Eye,
} from 'lucide-react'

export default function Profile() {
  const { user, isAdmin, logout } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [selectedTx, setSelectedTx] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await transactionService.getTransactions()
        setTransactions(data)
      } catch {
        setTransactions([])
      } finally {
        setLoadingOrders(false)
      }
    }
    loadOrders()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  const getStatusBadge = (status) => {
    const s = String(status || 'pending').toLowerCase()
    switch (s) {
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} />
            <span>Selesai</span>
          </span>
        )
      case 'dikirim':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Package size={11} />
            <span>Dikirim</span>
          </span>
        )
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={11} />
            <span>Diproses</span>
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-paper-white text-stone border border-hairline">
            <Clock size={11} />
            <span>Pending</span>
          </span>
        )
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-obsidian">Profil Pengguna</h1>
        <p className="text-xs text-stone mt-1">
          Informasi akun dan riwayat aktivitas transaksi Anda di BookSales.
        </p>
      </div>

      {/* User Info Card */}
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone hover:text-obsidian border border-hairline hover:border-smoke rounded-md transition-colors cursor-pointer self-start sm:self-auto"
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
        {isAdmin && (
          <div className="p-5 bg-paper-white/50 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-stone">
              Anda memiliki hak akses <strong>Administrator</strong>.
            </span>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors"
              >
                <span>Buka Admin Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Transaction History Section */}
      <div className="bg-pure-white rounded-lg border border-hairline shadow-xs overflow-hidden">
        <div className="p-6 border-b border-hairline flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-obsidian">Riwayat Transaksi Saya</h2>
            <p className="text-xs text-stone mt-0.5">
              Daftar seluruh pesanan buku yang pernah Anda lakukan.
            </p>
          </div>
          <span className="text-xs font-mono text-stone bg-paper-white px-2.5 py-1 rounded border border-hairline">
            {transactions.length} Pesanan
          </span>
        </div>

        {loadingOrders ? (
          <div className="p-6 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-hairline rounded-md animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-stone">
            <ShoppingBag size={36} className="mx-auto text-ash mb-2" />
            <p className="font-medium text-xs text-charcoal">Belum ada riwayat pesanan.</p>
            <p className="text-[11px] mt-1 mb-4">
              Pilih dan beli buku favorit Anda dari katalog toko kami.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-obsidian text-pure-white rounded-md hover:bg-carbon transition-colors"
            >
              <BookOpen size={13} />
              <span>Lihat Katalog Buku</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-hairline">
            {transactions.map((t) => (
              <div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-16 shrink-0 overflow-hidden rounded border border-hairline">
                    <BookCover
                      src={t.book?.cover_photo}
                      title={t.book?.title}
                      author={t.book?.author?.name}
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-bold text-obsidian">
                        {t.order_number || `ORD-${t.id}`}
                      </span>
                      {getStatusBadge(t.status)}
                    </div>
                    <h3 className="text-xs font-semibold text-charcoal line-clamp-1">
                      {t.book?.title || 'Buku Tidak Diketahui'}
                    </h3>
                    <p className="text-[11px] text-stone mt-0.5">
                      Jumlah: <strong className="text-charcoal">{t.quantity}</strong> eksemplar · {formatDate(t.created_at)}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 flex flex-col items-start sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-stone block">Total Pembayaran</span>
                    <span className="text-sm font-bold font-mono text-obsidian">
                      {formatPrice(t.total_amount)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTx(t)
                      setIsDetailOpen(true)
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-charcoal hover:text-obsidian bg-paper-white border border-hairline hover:border-smoke rounded transition-colors cursor-pointer"
                  >
                    <Eye size={12} />
                    <span>Lihat Rincian</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Detail & Invoice Modal */}
      <TransactionDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedTx(null)
        }}
        initialData={selectedTx}
      />
    </div>
  )
}
