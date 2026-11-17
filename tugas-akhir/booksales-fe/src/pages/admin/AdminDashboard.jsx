import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import genreService from '../../services/genreService'
import authorService from '../../services/authorService'
import bookService from '../../services/bookService'
import transactionService from '../../services/transactionService'
import {
  Bookmark,
  Users,
  BookOpen,
  ArrowUpRight,
  Plus,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Package,
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    genres: 0,
    authors: 0,
    books: 0,
    transactions: 0,
    revenue: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [genres, authors, books, txs] = await Promise.allSettled([
          genreService.getGenres(),
          authorService.getAuthors(),
          bookService.getBooks(),
          transactionService.getTransactions(),
        ])

        const txList = txs.status === 'fulfilled' ? txs.value : []
        const totalRevenue = txList.reduce(
          (sum, t) => sum + (Number(t.total_amount) || 0),
          0
        )

        setStats({
          genres: genres.status === 'fulfilled' ? genres.value.length : 0,
          authors: authors.status === 'fulfilled' ? authors.value.length : 0,
          books: books.status === 'fulfilled' ? books.value.length : 0,
          transactions: txList.length,
          revenue: totalRevenue,
        })

        setRecentTransactions(txList.slice(0, 5))
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return d.toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status) => {
    const s = String(status || 'pending').toLowerCase()
    switch (s) {
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={10} />
            <span>Selesai</span>
          </span>
        )
      case 'dikirim':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Package size={10} />
            <span>Dikirim</span>
          </span>
        )
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={10} />
            <span>Diproses</span>
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-paper-white text-stone border border-hairline">
            <Clock size={10} />
            <span>Pending</span>
          </span>
        )
    }
  }

  const cards = [
    {
      title: 'Total Pendapatan',
      count: formatPrice(stats.revenue),
      link: '/admin/transactions',
      icon: TrendingUp,
      desc: 'Akumulasi nilai seluruh pesanan',
      isPrice: true,
    },
    {
      title: 'Total Transaksi',
      count: stats.transactions,
      link: '/admin/transactions',
      icon: ShoppingBag,
      desc: 'Seluruh pesanan buku dari pelanggan',
    },
    {
      title: 'Total Buku',
      count: stats.books,
      link: '/admin/books',
      icon: BookOpen,
      desc: 'Koleksi judul buku dalam katalog',
    },
    {
      title: 'Total Penulis',
      count: stats.authors,
      link: '/admin/authors',
      icon: Users,
      desc: 'Penulis dan kontributor terdaftar',
    },
    {
      title: 'Total Genre',
      count: stats.genres,
      link: '/admin/genres',
      icon: Bookmark,
      desc: 'Kategori dan klasifikasi buku',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-obsidian">Dashboard Administrator</h1>
        <p className="text-xs text-stone mt-1">
          Ringkasan master data dan operasional penjualan toko buku BookSales.
        </p>
      </div>

      {/* Primary Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.title}
              className="p-5 bg-pure-white border border-hairline rounded-lg shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-stone mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider">{c.title}</span>
                  <Icon size={16} />
                </div>
                <div
                  className={`font-bold tracking-tight text-obsidian mb-1 ${
                    c.isPrice ? 'text-2xl font-mono' : 'text-3xl'
                  }`}
                >
                  {loading ? '—' : c.count}
                </div>
                <p className="text-xs text-stone">{c.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-hairline">
                <Link
                  to={c.link}
                  className="inline-flex items-center gap-1 text-xs font-medium text-obsidian hover:text-charcoal transition-colors"
                >
                  <span>Kelola data</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-pure-white rounded-lg border border-hairline shadow-xs overflow-hidden mb-8">
        <div className="p-5 border-b border-hairline flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-obsidian">Transaksi Terbaru</h2>
            <p className="text-xs text-stone mt-0.5">5 pesanan terakhir yang masuk ke dalam sistem.</p>
          </div>
          <Link
            to="/admin/transactions"
            className="text-xs font-medium text-charcoal hover:text-obsidian inline-flex items-center gap-1"
          >
            <span>Semua Transaksi</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-hairline bg-paper-white/70 text-stone font-mono uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Order</th>
                <th className="py-2.5 px-4">Pelanggan</th>
                <th className="py-2.5 px-4">Buku</th>
                <th className="py-2.5 px-4">Total</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3 px-4"><div className="h-3 w-16 bg-hairline rounded" /></td>
                    <td className="py-3 px-4"><div className="h-3 w-24 bg-hairline rounded" /></td>
                    <td className="py-3 px-4"><div className="h-3 w-32 bg-hairline rounded" /></td>
                    <td className="py-3 px-4"><div className="h-3 w-16 bg-hairline rounded" /></td>
                    <td className="py-3 px-4"><div className="h-4 w-14 bg-hairline rounded" /></td>
                    <td className="py-3 px-4"><div className="h-3 w-16 bg-hairline rounded" /></td>
                  </tr>
                ))
              ) : recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone text-xs">
                    Belum ada transaksi tercatat.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-paper-white/40 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-obsidian">
                      {tx.order_number || `ORD-${tx.id}`}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-obsidian">
                      {tx.customer?.name || 'Pelanggan'}
                    </td>
                    <td className="py-2.5 px-4 text-charcoal line-clamp-1">
                      {tx.book?.title || 'Judul Buku'} ({tx.quantity}x)
                    </td>
                    <td className="py-2.5 px-4 font-mono font-medium text-obsidian">
                      {formatPrice(tx.total_amount)}
                    </td>
                    <td className="py-2.5 px-4">
                      {getStatusBadge(tx.status)}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone text-[11px]">
                      {formatDate(tx.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Info Card */}
      <div className="p-6 bg-pure-white border border-hairline rounded-lg shadow-xs">
        <h2 className="text-sm font-semibold text-obsidian mb-2">Aksi Cepat Manajemen</h2>
        <p className="text-xs text-stone mb-4 max-w-xl leading-relaxed">
          Gunakan pintasan di bawah ini untuk mengelola katalog buku atau memantau transaksi yang membutuhkan pembaruan status pengiriman.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/books"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-obsidian text-pure-white hover:bg-carbon rounded-md transition-colors"
          >
            <Plus size={13} />
            <span>Kelola & Tambah Buku</span>
          </Link>
          <Link
            to="/admin/transactions"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-paper-white text-obsidian border border-hairline hover:border-smoke rounded-md transition-colors"
          >
            <ShoppingBag size={13} />
            <span>Kelola Pesanan Masuk</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
