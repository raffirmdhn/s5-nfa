import { useState } from 'react'
import Modal from '../common/Modal'
import genreService from '../../services/genreService'
import { Loader2 } from 'lucide-react'

export default function GenreModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Nama genre wajib diisi.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await genreService.createGenre({
        name: name.trim(),
        description: description.trim() || null,
      })
      setName('')
      setDescription('')
      onSuccess?.()
      onClose()
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Gagal menambahkan genre.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Genre Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
            Nama Genre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Fiction, Science, Novel"
            className="w-full px-3 py-2 text-sm bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
            Deskripsi (Opsional)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Keterangan singkat mengenai kategori/genre ini..."
            className="w-full px-3 py-2 text-sm bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors resize-none"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? 'Menyimpan...' : 'Simpan Genre'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

