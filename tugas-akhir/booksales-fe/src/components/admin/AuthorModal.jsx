import { useState } from 'react'
import Modal from '../common/Modal'
import authorService from '../../services/authorService'
import { Loader2 } from 'lucide-react'

export default function AuthorModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Nama penulis wajib diisi.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await authorService.createAuthor({
        name: name.trim(),
        photo: photo.trim() || null,
        bio: bio.trim() || null,
      })
      setName('')
      setPhoto('')
      setBio('')
      onSuccess?.()
      onClose()
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Gagal menambahkan penulis.')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setPhoto('')
    setBio('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Penulis Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
            Nama Penulis <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Andrea Hirata, Tere Liye, J.K. Rowling"
            className="w-full px-3 py-2 text-sm bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
            URL Foto (Opsional)
          </label>
          <input
            type="url"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full px-3 py-2 text-sm bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
            Biografi Singkat (Opsional)
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Keterangan latar belakang atau profil penulis..."
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
            {loading ? 'Menyimpan...' : 'Simpan Penulis'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

