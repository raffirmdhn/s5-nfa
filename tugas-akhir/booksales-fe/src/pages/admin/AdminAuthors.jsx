import { useState, useEffect } from 'react'
import authorService from '../../services/authorService'
import AuthorModal from '../../components/admin/AuthorModal'
import { Plus, Search, Users, RefreshCw, AlertCircle, CheckCircle2, User } from 'lucide-react'

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)

  const fetchAuthors = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await authorService.getAuthors()
      setAuthors(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar penulis.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthors()
  }, [])

  const handleSuccess = () => {
    fetchAuthors()
    setNotification('Penulis baru berhasil ditambahkan!')
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const filteredAuthors = authors.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.bio?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-obsidian">Manajemen Penulis</h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-paper-white text-charcoal border border-hairline rounded-full">
              {authors.length}
            </span>
          </div>
          <p className="text-xs text-stone mt-1">
            Kelola data dan biografi penulis buku di BookSales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah Penulis</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="mb-4 p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchAuthors}
            className="text-xs underline hover:no-underline font-medium cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Control Bar: Search & Refresh */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama penulis atau biografi..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
          />
          <Search size={14} className="absolute left-2.5 top-2 text-stone pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={fetchAuthors}
          title="Segarkan Data"
          disabled={loading}
          className="p-1.5 text-stone hover:text-obsidian rounded-md border border-hairline bg-pure-white hover:bg-paper-white transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-pure-white rounded-lg border border-hairline shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-hairline bg-paper-white/70 text-stone font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-16">ID</th>
                <th className="py-3 px-4">Penulis</th>
                <th className="py-3 px-4">Biografi</th>
                <th className="py-3 px-4 w-36">Dibuat Pada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-3 w-6 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-8 w-36 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-48 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-20 bg-hairline rounded" /></td>
                  </tr>
                ))
              ) : filteredAuthors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone">
                    <Users size={24} className="mx-auto mb-2 text-ash" />
                    <p className="font-medium text-charcoal">Tidak ada penulis yang ditemukan</p>
                    <p className="text-[11px] mt-0.5">
                      {search ? 'Coba kata kunci pencarian yang lain.' : 'Klik tombol "Tambah Penulis" untuk menambahkan data baru.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAuthors.map((author) => (
                  <tr
                    key={author.id}
                    className="hover:bg-paper-white/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-stone text-[11px]">
                      #{author.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {author.photo ? (
                          <img
                            src={author.photo}
                            alt={author.name}
                            className="w-8 h-8 rounded-full object-cover border border-hairline bg-paper-white"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-hairline flex items-center justify-center text-stone font-mono text-xs">
                            {author.name ? author.name.charAt(0).toUpperCase() : <User size={13} />}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-obsidian">{author.name}</div>
                          {author.photo && (
                            <span className="text-[10px] text-smoke font-mono truncate max-w-[140px] block">
                              {author.photo}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-charcoal max-w-md truncate">
                      {author.bio || (
                        <span className="text-smoke italic">Tidak ada biografi</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone text-[11px]">
                      {formatDate(author.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <AuthorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
