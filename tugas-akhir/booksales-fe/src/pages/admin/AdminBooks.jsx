import { useState, useEffect } from 'react'
import bookService from '../../services/bookService'
import genreService from '../../services/genreService'
import BookModal from '../../components/admin/BookModal'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'
import BookCover from '../../components/common/BookCover'
import { Plus, Search, BookOpen, RefreshCw, AlertCircle, CheckCircle2, Pencil, Trash2, Filter } from 'lucide-react'

export default function AdminBooks() {
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const [booksData, genresData] = await Promise.all([
        bookService.getBooks(),
        genreService.getGenres(),
      ])
      setBooks(booksData)
      setGenres(genresData)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat daftar buku.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
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

  const handleOpenEdit = (book) => {
    setItemToEdit(book)
    setIsModalOpen(true)
  }

  const handleOpenDelete = (book) => {
    setBookToDelete(book)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return
    setDeleteLoading(true)
    try {
      await bookService.deleteBook(bookToDelete.id)
      setIsDeleteModalOpen(false)
      showToast(`Buku "${bookToDelete.title}" berhasil dihapus!`)
      fetchBooks()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus data buku.'
      alert(msg)
    } finally {
      setDeleteLoading(false)
      setBookToDelete(null)
    }
  }

  const handleSuccess = (msg) => {
    fetchBooks()
    showToast(msg || 'Data buku berhasil diperbarui!')
  }

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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.name?.toLowerCase().includes(search.toLowerCase())
    const matchGenre =
      selectedGenre === 'all' ||
      String(b.genre_id) === String(selectedGenre) ||
      b.genre?.name === selectedGenre
    return matchSearch && matchGenre
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-obsidian">Manajemen Buku</h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-paper-white text-charcoal border border-hairline rounded-full">
              {books.length}
            </span>
          </div>
          <p className="text-xs text-stone mt-1">
            Kelola, tambah, perbarui, dan hapus katalog buku pada platform BookSales.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={14} />
          <span>Tambah Buku</span>
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
            onClick={fetchBooks}
            className="text-xs underline hover:no-underline font-medium cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Control Bar: Search, Genre Filter, Refresh */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul buku atau penulis..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-stone pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-stone hidden sm:block" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian transition-colors cursor-pointer"
            >
              <option value="all">Semua Genre ({books.length})</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchBooks}
          title="Segarkan Data"
          disabled={loading}
          className="p-1.5 text-stone hover:text-obsidian rounded-md border border-hairline bg-pure-white hover:bg-paper-white transition-colors cursor-pointer self-end sm:self-auto"
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
                <th className="py-3 px-4 w-12">ID</th>
                <th className="py-3 px-4">Buku & Penulis</th>
                <th className="py-3 px-4">Genre</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Stok</th>
                <th className="py-3 px-4 w-28">Dibuat Pada</th>
                <th className="py-3 px-4 w-24 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-3 w-6 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-8 w-44 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-20 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-16 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-10 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-16 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-3 w-12 bg-hairline rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone">
                    <BookOpen size={24} className="mx-auto mb-2 text-ash" />
                    <p className="font-medium text-charcoal">Tidak ada buku yang ditemukan</p>
                    <p className="text-[11px] mt-0.5">
                      {search ? 'Coba kata kunci pencarian yang lain.' : 'Klik tombol "Tambah Buku" untuk menambahkan judul baru.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-paper-white/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-stone text-[11px]">
                      #{book.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 shrink-0 overflow-hidden rounded border border-hairline">
                          <BookCover
                            src={book.cover_photo}
                            title={book.title}
                            author={book.author?.name}
                            className="w-full h-full text-[8px]"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-obsidian line-clamp-1">{book.title}</div>
                          <div className="text-[11px] text-stone">
                            {book.author?.name || 'Anonim'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-paper-white border border-hairline text-charcoal">
                        {book.genre?.name || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-obsidian">
                      {formatPrice(book.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          Number(book.stock || 0) <= 0 ? 'text-red-600' : 'text-obsidian'
                        }`}
                      >
                        {book.stock ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone text-[11px]">
                      {formatDate(book.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(book)}
                          title="Perbarui Buku"
                          className="p-1.5 text-stone hover:text-obsidian hover:bg-hairline/60 rounded transition-colors cursor-pointer"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(book)}
                          title="Hapus Buku"
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

      {/* Book Form Modal */}
      <BookModal
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
        itemName={bookToDelete?.title}
        title="Hapus Data Buku"
        description="Apakah Anda yakin ingin menghapus buku ini? Data yang dihapus tidak dapat dipulihkan."
        loading={deleteLoading}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setBookToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
