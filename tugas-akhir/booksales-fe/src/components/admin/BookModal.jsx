import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import bookService from '../../services/bookService'
import authorService from '../../services/authorService'
import genreService from '../../services/genreService'
import { Loader2 } from 'lucide-react'

export default function BookModal({ isOpen, onClose, onSuccess, itemToEdit = null }) {
  const [title, setTitle] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [genreId, setGenreId] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [coverPhoto, setCoverPhoto] = useState('')
  const [description, setDescription] = useState('')

  const [authors, setAuthors] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isEditMode = Boolean(itemToEdit)

  useEffect(() => {
    async function loadOptions() {
      try {
        const [authorsData, genresData] = await Promise.all([
          authorService.getAuthors(),
          genreService.getGenres(),
        ])
        setAuthors(authorsData)
        setGenres(genresData)
      } catch {
        // Ignore option load errors
      }
    }

    if (isOpen) {
      loadOptions()
      if (itemToEdit) {
        setTitle(itemToEdit.title || '')
        setAuthorId(itemToEdit.author_id || itemToEdit.author?.id || '')
        setGenreId(itemToEdit.genre_id || itemToEdit.genre?.id || '')
        setPrice(itemToEdit.price || '')
        setStock(itemToEdit.stock ?? '')
        setCoverPhoto(itemToEdit.cover_photo || '')
        setDescription(itemToEdit.description || '')
      } else {
        setTitle('')
        setAuthorId('')
        setGenreId('')
        setPrice('')
        setStock('')
        setCoverPhoto('')
        setDescription('')
      }
      setError(null)
    }
  }, [isOpen, itemToEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Judul buku wajib diisi.')
      return
    }
    if (!authorId) {
      setError('Pilih salah satu penulis.')
      return
    }
    if (!genreId) {
      setError('Pilih salah satu genre.')
      return
    }
    if (price === '' || Number(price) < 0) {
      setError('Harga buku harus bernilai angka positif.')
      return
    }
    if (stock === '' || Number(stock) < 0) {
      setError('Stok buku harus bernilai 0 atau lebih.')
      return
    }

    setLoading(true)
    setError(null)

    const payload = {
      title: title.trim(),
      author_id: Number(authorId),
      genre_id: Number(genreId),
      price: Number(price),
      stock: Number(stock),
      cover_photo: coverPhoto.trim() || null,
      description: description.trim() || null,
    }

    try {
      if (isEditMode) {
        await bookService.updateBook(itemToEdit.id, payload)
        onSuccess?.('Buku berhasil diperbarui!')
      } else {
        await bookService.createBook(payload)
        onSuccess?.('Buku baru berhasil ditambahkan!')
      }
      handleClose()
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : isEditMode
          ? 'Gagal memperbarui data buku.'
          : 'Gagal menambahkan buku baru.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setAuthorId('')
    setGenreId('')
    setPrice('')
    setStock('')
    setCoverPhoto('')
    setDescription('')
    setError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Perbarui Data Buku' : 'Tambah Buku Baru'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1 uppercase tracking-wider font-mono">
            Judul Buku <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Laskar Pelangi, Bumi Manusia"
            className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-charcoal mb-1 uppercase tracking-wider font-mono">
              Penulis <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs cursor-pointer"
            >
              <option value="">-- Pilih Penulis --</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1 uppercase tracking-wider font-mono">
              Genre <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={genreId}
              onChange={(e) => setGenreId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs cursor-pointer"
            >
              <option value="">-- Pilih Genre --</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-charcoal mb-1 uppercase tracking-wider font-mono">
              Harga (IDR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Contoh: 85000"
              className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal mb-1 uppercase tracking-wider font-mono">
              Jumlah Stok <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Contoh: 20"
              className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1 uppercase tracking-wider font-mono">
            URL Foto Cover (Opsional)
          </label>
          <input
            type="url"
            value={coverPhoto}
            onChange={(e) => setCoverPhoto(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1 uppercase tracking-wider font-mono">
            Sinopsis / Deskripsi
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Sinopsis singkat mengenai buku..."
            className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-hairline">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-charcoal hover:text-obsidian bg-paper-white border border-hairline rounded-md hover:bg-hairline/40 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan Buku'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
