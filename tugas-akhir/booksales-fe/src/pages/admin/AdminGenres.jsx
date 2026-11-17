import { useState, useEffect } from 'react'
import genreService from '../../services/genreService'
import GenreModal from '../../components/admin/GenreModal'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'
import { Plus, Search, Bookmark, RefreshCw, AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react'

export default function AdminGenres() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [genreToDelete, setGenreToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchGenres = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await genreService.getGenres()
      setGenres(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar genre.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  const showToast = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleOpenCreate = () => {
    setItemToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (genre) => {
    setItemToEdit(genre)
    setIsModalOpen(true)
  }

  const handleOpenDelete = (genre) => {
    setGenreToDelete(genre)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!genreToDelete) return
    setDeleteLoading(true)
    try {
      await genreService.deleteGenre(genreToDelete.id)
      setIsDeleteModalOpen(false)
      showToast(`Genre "${genreToDelete.name}" berhasil dihapus!`)
      fetchGenres()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus genre.'
      alert(msg)
    } finally {
      setDeleteLoading(false)
      setGenreToDelete(null)
    }
  }

  const handleSuccess = (msg) => {
    fetchGenres()
    showToast(msg || 'Data genre berhasil diperbarui!')
  }

  const filteredGenres = genres.filter((g) =>
    g.name?.toLowerCase().includes(search.toLowerCase()) ||
    g.description?.toLowerCase().includes(search.toLowerCase())
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-obsidian">Manajemen Genre</h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-paper-white text-charcoal border border-hairline rounded-full">
              {genres.length}
            </span>
          </div>
          <p className="text-xs text-stone mt-1">
            Kelola, perbarui, dan hapus kategori buku pada platform BookSales.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah Genre</span>
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
            onClick={fetchGenres}
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
            placeholder="Cari nama genre atau deskripsi..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
          />
          <Search size={14} className="absolute left-2.5 top-2 text-stone pointer-events-none" />
        </div>

        <button
          type="button"
          onClick={fetchGenres}
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
                <th className="py-3 px-4">Nama Genre</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4 w-32">Dibuat Pada</th>
                <th className="py-3 px-4 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-3 w-6 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-32 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-48 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-20 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-3 w-12 bg-hairline rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredGenres.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone">
                    <Bookmark size={24} className="mx-auto mb-2 text-ash" />
                    <p className="font-medium text-charcoal">Tidak ada genre yang ditemukan</p>
                    <p className="text-[11px] mt-0.5">
                      {search ? 'Coba kata kunci pencarian yang lain.' : 'Klik tombol "Tambah Genre" untuk menambahkan kategori baru.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredGenres.map((genre) => (
                  <tr
                    key={genre.id}
                    className="hover:bg-paper-white/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-stone text-[11px]">
                      #{genre.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-obsidian">{genre.name}</span>
                    </td>
                    <td className="py-3 px-4 text-charcoal max-w-md truncate">
                      {genre.description || (
                        <span className="text-smoke italic">Tidak ada deskripsi</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone text-[11px]">
                      {formatDate(genre.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(genre)}
                          title="Perbarui Genre"
                          className="p-1.5 text-stone hover:text-obsidian hover:bg-hairline/60 rounded transition-colors cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(genre)}
                          title="Hapus Genre"
                          className="p-1.5 text-stone hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual-Mode Create / Edit Modal */}
      <GenreModal
        isOpen={isModalOpen}
        itemToEdit={itemToEdit}
        onClose={() => {
          setIsModalOpen(false)
          setItemToEdit(null)
        }}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemName={genreToDelete?.name}
        title="Hapus Data Genre"
        description="Apakah Anda yakin ingin menghapus genre ini? Buku-buku yang terikat dengan genre ini dapat terhapus secara permanen."
        loading={deleteLoading}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setGenreToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
