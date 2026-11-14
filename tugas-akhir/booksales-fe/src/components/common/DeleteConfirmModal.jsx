import Modal from './Modal'
import { AlertTriangle, Loader2 } from 'lucide-react'

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus Data',
  itemName,
  description,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-obsidian">
              Apakah Anda yakin ingin menghapus{' '}
              {itemName ? <span className="font-bold underline text-red-600">"{itemName}"</span> : 'data ini'}?
            </p>
            <p className="text-xs text-stone mt-1.5 leading-relaxed">
              {description ||
                'Tindakan ini tidak dapat dibatalkan. Data buku atau relasi terkait mungkin akan terpengaruh.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-hairline">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-charcoal hover:text-obsidian bg-paper-white border border-hairline rounded-md hover:bg-hairline/40 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-pure-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? 'Menghapus...' : 'Ya, Hapus Data'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

