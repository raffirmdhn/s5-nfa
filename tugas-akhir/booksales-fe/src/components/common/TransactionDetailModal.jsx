import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from './Modal'
import BookCover from './BookCover'
import transactionService from '../../services/transactionService'
import {
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  CreditCard,
  MapPin,
  Phone,
  User,
  FileText,
  Loader2,
  ExternalLink,
  Printer,
} from 'lucide-react'

export default function TransactionDetailModal({ isOpen, onClose, transactionId, initialData = null }) {
  const [transaction, setTransaction] = useState(initialData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTransaction(initialData)
      } else if (transactionId) {
        setLoading(true)
        transactionService
          .getTransactionById(transactionId)
          .then((data) => setTransaction(data))
          .catch(() => setTransaction(null))
          .finally(() => setLoading(false))
      }
    } else {
      setTransaction(null)
    }
  }, [isOpen, transactionId, initialData])

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
      month: 'long',
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
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Selesai</span>
          </span>
        )
      case 'dikirim':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <Package size={12} className="text-blue-600" />
            <span>Dikirim</span>
          </span>
        )
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={12} className="text-amber-600" />
            <span>Diproses</span>
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-paper-white text-stone border border-hairline">
            <Clock size={12} />
            <span>Pending</span>
          </span>
        )
    }
  }

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'bank_transfer':
        return 'Transfer Bank Otomatis'
      case 'qris':
        return 'QRIS / E-Wallet'
      case 'cod':
        return 'Bayar di Tempat (COD)'
      default:
        return method || 'Transfer Bank'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rincian Faktur & Pesanan">
      {loading ? (
        <div className="py-12 text-center text-stone">
          <Loader2 size={24} className="mx-auto animate-spin mb-2" />
          <p className="text-xs">Memuat detail pesanan...</p>
        </div>
      ) : !transaction ? (
        <div className="py-8 text-center text-xs text-stone">
          Data transaksi tidak ditemukan.
        </div>
      ) : (
        <div className="space-y-5 text-xs max-h-[75vh] overflow-y-auto pr-1">
          {/* Header Bar */}
          <div className="p-4 bg-paper-white/70 border border-hairline rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone block">
                Nomor Pesanan
              </span>
              <span className="text-sm font-bold font-mono text-obsidian">
                {transaction.order_number || `BS-${transaction.id}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(transaction.status)}
            </div>
          </div>

          {/* Tanggal & Waktu */}
          <div className="flex items-center gap-1.5 text-stone text-[11px]">
            <Calendar size={13} />
            <span>Waktu Transaksi:</span>
            <span className="text-obsidian font-medium font-mono">
              {formatDate(transaction.created_at)}
            </span>
          </div>

          {/* Rincian Produk Buku */}
          <div className="border border-hairline rounded-lg p-4 bg-pure-white shadow-xs space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-stone flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText size={13} />
                <span>Buku Yang Dipesan ({transaction.items?.length || 1})</span>
              </span>
              <span className="font-mono text-stone">
                Total: {transaction.total_items || transaction.quantity || 1} eksemplar
              </span>
            </h3>

            <div className="divide-y divide-hairline">
              {(transaction.items && transaction.items.length > 0
                ? transaction.items
                : [
                    {
                      id: transaction.id,
                      title: transaction.book?.title,
                      author: transaction.book?.author?.name,
                      cover_photo: transaction.book?.cover_photo,
                      quantity: transaction.quantity,
                      price: transaction.book?.price,
                      subtotal: transaction.total_amount,
                    },
                  ]
              ).map((item, idx) => (
                <div key={item.id || idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                  <div className="w-12 h-16 shrink-0 overflow-hidden rounded border border-hairline">
                    <BookCover
                      src={item.cover_photo || item.book?.cover_photo}
                      title={item.title || item.book?.title}
                      author={item.author || item.book?.author?.name}
                      className="w-full h-full text-[7px]"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-obsidian line-clamp-1">
                      {item.title || item.book?.title || 'Judul Buku'}
                    </h4>
                    <p className="text-[11px] text-stone">
                      {item.author || item.book?.author?.name || 'Penulis Tidak Diketahui'}
                    </p>
                    <div className="text-[11px] text-stone mt-1">
                      {item.quantity} x {formatPrice(item.price || item.book?.price || 0)}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-stone block">Subtotal</span>
                    <span className="text-xs font-mono font-bold text-obsidian">
                      {formatPrice(item.subtotal || item.total_amount || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rincian Pengiriman */}
          <div className="border border-hairline rounded-lg p-4 bg-pure-white shadow-xs space-y-3">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-stone flex items-center gap-1.5">
              <MapPin size={13} />
              <span>Informasi Pengiriman</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-stone block text-[10px]">Nama Penerima</span>
                <span className="font-semibold text-obsidian flex items-center gap-1">
                  <User size={12} className="text-stone" />
                  {transaction.recipient_name || transaction.customer?.name || '-'}
                </span>
              </div>

              <div>
                <span className="text-stone block text-[10px]">Nomor WhatsApp / HP</span>
                <span className="font-mono text-obsidian flex items-center gap-1">
                  <Phone size={12} className="text-stone" />
                  {transaction.phone || '-'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-stone block text-[10px]">Alamat Lengkap</span>
                <p className="text-charcoal leading-relaxed mt-0.5">
                  {transaction.shipping_address || 'Alamat tidak dicantumkan (Ambil di tempat / Toko)'}
                </p>
              </div>

              {transaction.notes && (
                <div className="sm:col-span-2">
                  <span className="text-stone block text-[10px]">Catatan Pengiriman</span>
                  <p className="text-charcoal italic mt-0.5">{transaction.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Rincian Pembayaran */}
          <div className="border border-hairline rounded-lg p-4 bg-pure-white shadow-xs space-y-2">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-stone mb-2 flex items-center gap-1.5">
              <CreditCard size={13} />
              <span>Rincian Pembayaran</span>
            </h3>

            <div className="flex justify-between text-stone">
              <span>Metode Pembayaran</span>
              <span className="font-medium text-obsidian">
                {getPaymentMethodLabel(transaction.payment_method)}
              </span>
            </div>

            <div className="flex justify-between text-stone">
              <span>Biaya Pengiriman</span>
              <span className="text-charcoal font-medium">Gratis</span>
            </div>

            <div className="flex justify-between text-obsidian font-semibold pt-2 border-t border-hairline">
              <span>Total Tagihan</span>
              <span className="text-sm font-bold font-mono">
                {formatPrice(transaction.total_amount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-hairline flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.open(`/invoice/${transaction.order_number || transaction.id}?autoprint=1`, '_blank')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-obsidian bg-paper-white border border-hairline hover:border-smoke rounded-md transition-colors cursor-pointer"
              title="Cetak Faktur (Auto Print & Close)"
            >
              <Printer size={13} />
              <span>Cetak Faktur</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium bg-obsidian text-pure-white hover:bg-carbon rounded-md transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
