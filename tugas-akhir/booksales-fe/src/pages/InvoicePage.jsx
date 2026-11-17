import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import transactionService from '../services/transactionService'
import { Printer, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

export default function InvoicePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTransaction() {
      setLoading(true)
      setError('')
      try {
        const data = await transactionService.getTransactionById(id)
        if (!data) {
          setError('Transaksi tidak ditemukan.')
        } else {
          setTransaction(data)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat dokumen faktur.')
      } finally {
        setLoading(false)
      }
    }
    loadTransaction()
  }, [id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(price || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getInvoiceCode = (tx) => {
    if (!tx) return '-'
    const d = tx.created_at ? new Date(tx.created_at) : new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const cleanNumber = (tx.order_number || `ORD${tx.id}`).replace(/[^a-zA-Z0-9]/g, '')
    return `INV/${yyyy}${mm}${dd}/BS/${cleanNumber}`
  }

  const getPaymentLabel = (method) => {
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

  // Watermark stempel dinamis sesuai status transaksi
  const renderWatermark = (status) => {
    const s = String(status || 'pending').toLowerCase()
    let text = 'BELUM LUNAS'
    let style = 'border-stone-400/35 text-stone-500/35'

    if (s === 'selesai') {
      text = 'SUDAH LUNAS'
      style = 'border-emerald-600/35 text-emerald-600/35'
    } else if (s === 'dikirim') {
      text = 'DIKIRIM'
      style = 'border-blue-500/35 text-blue-500/35'
    } else if (s === 'diproses') {
      text = 'DIPROSES'
      style = 'border-amber-500/35 text-amber-500/35'
    }

    return (
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
        <div
          className={`transform -rotate-25 border-4 border-dashed rounded-2xl px-8 py-3.5 text-3xl sm:text-5xl font-black font-mono tracking-widest ${style}`}
        >
          {text}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-white flex items-center justify-center text-stone">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin mb-3 text-obsidian" />
          <p className="text-xs font-mono">Memuat faktur resmi BookSales...</p>
        </div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-paper-white flex items-center justify-center p-4">
        <div className="bg-white border border-hairline rounded-lg p-6 max-w-sm text-center shadow-xs">
          <AlertCircle size={36} className="mx-auto text-stone mb-3" />
          <h2 className="text-sm font-semibold text-obsidian mb-1">Faktur Tidak Ditemukan</h2>
          <p className="text-xs text-stone mb-4">{error || 'Data transaksi tidak ditemukan dalam sistem.'}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs bg-obsidian text-pure-white rounded-md hover:bg-carbon transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 sm:py-10 px-4 print:bg-white print:p-0 print:m-0">
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-charcoal hover:text-obsidian bg-white border border-hairline rounded-md hover:bg-paper-white transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors cursor-pointer shadow-xs"
        >
          <Printer size={14} />
          <span>Cetak Faktur / Simpan PDF</span>
        </button>
      </div>

      {/* Invoice Paper Document (Tokopedia style layout) */}
      <div className="max-w-3xl mx-auto bg-white border border-hairline rounded-xl p-6 sm:p-10 shadow-sm relative overflow-hidden print:border-0 print:shadow-none print:p-0 print:max-w-none print:rounded-none">
        {/* Dynamic Watermark Stamp */}
        {renderWatermark(transaction.status)}

        {/* Content Container (Layered above watermark) */}
        <div className="relative z-10 space-y-6">
          {/* Header Brand */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-hairline pb-5 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-bold text-xl tracking-tight">▲ booksales</span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Official Receipt
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono uppercase tracking-widest text-stone block">
                FAKTUR PEMBELIAN
              </span>
              <span className="text-xs font-mono text-obsidian font-bold">
                {transaction.order_number || `ORD-${transaction.id}`}
              </span>
            </div>
          </div>

          {/* Metadata Section: Invoice Info & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal">
            {/* Left: Nomor Invoice & Tanggal */}
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-28 text-stone">Nomor Invoice</span>
                <span className="font-mono font-medium text-emerald-700">: {getInvoiceCode(transaction)}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-stone">Tanggal Transaksi</span>
                <span className="font-mono text-obsidian">: {formatDate(transaction.created_at)}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-stone">Pembayaran</span>
                <span className="font-medium text-obsidian">: {getPaymentLabel(transaction.payment_method)}</span>
              </div>
            </div>

            {/* Right: Diterbitkan Untuk (Kepada) */}
            <div className="space-y-1.5 sm:border-l sm:border-hairline sm:pl-6">
              <div className="flex items-start">
                <span className="w-16 text-stone shrink-0">Kepada</span>
                <span className="font-semibold text-obsidian">
                  : {transaction.recipient_name || transaction.customer?.name || 'Pelanggan'}
                </span>
              </div>
              {transaction.phone && (
                <div className="flex items-start">
                  <span className="w-16 text-stone shrink-0">Telepon</span>
                  <span className="font-mono text-obsidian">: {transaction.phone}</span>
                </div>
              )}
              <div className="flex items-start">
                <span className="w-16 text-stone shrink-0">Alamat</span>
                <span className="text-obsidian leading-relaxed">
                  : {transaction.shipping_address || 'Ambil di Toko / Alamat Tidak Dicantumkan'}
                </span>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="border-t border-hairline pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-hairline bg-paper-white/50 text-obsidian font-semibold">
                    <th className="py-2.5 px-3">Nama Produk</th>
                    <th className="py-2.5 px-3 w-20 text-center">Qty</th>
                    <th className="py-2.5 px-3 w-32 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 w-36 text-right">Jumlah (IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  <tr>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-obsidian">
                        {transaction.book?.title || 'Judul Buku'}
                      </div>
                      <div className="text-[11px] text-stone">
                        Penulis: {transaction.book?.author?.name || 'Penulis Tidak Diketahui'}
                      </div>
                      {transaction.notes && (
                        <div className="text-[10px] text-stone mt-1 italic">
                          Catatan: {transaction.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-medium text-obsidian">
                      {transaction.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-obsidian">
                      {formatPrice(transaction.book?.price || 0)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-obsidian">
                      {formatPrice(transaction.total_amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-4 flex flex-col items-end space-y-2 text-xs">
              <div className="w-full sm:w-80 flex justify-between py-1 border-t border-hairline text-stone">
                <span className="font-semibold text-obsidian">Subtotal</span>
                <span className="font-mono font-bold text-obsidian">
                  {formatPrice(transaction.total_amount)}
                </span>
              </div>

              <div className="w-full sm:w-80 flex justify-between py-1 text-stone">
                <span>Biaya Pengiriman (Bebas Ongkir)</span>
                <span className="font-mono text-obsidian">Rp 0,00</span>
              </div>

              {/* Tokopedia-like Highlighted Total Box */}
              <div className="w-full sm:w-80 border-2 border-obsidian rounded-md p-3 flex justify-between items-center bg-white shadow-xs">
                <span className="text-xs font-bold text-obsidian uppercase tracking-wider">
                  Total Bayar
                </span>
                <span className="text-base font-black font-mono text-obsidian">
                  {formatPrice(transaction.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Important Information Section */}
          <div className="border-t border-hairline pt-6 text-[11px] text-stone space-y-1.5 leading-relaxed">
            <p className="font-semibold text-obsidian">Informasi Penting:</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Invoice ini berfungsi sebagai tanda terima pembayaran pemesanan yang sah.</li>
              <li>
                Diterbitkan secara elektronik oleh sistem resmi <strong>BookSales · STT Terpadu Nurul Fikri</strong>.
              </li>
              <li>
                Jika memerlukan konfirmasi pengiriman atau bantuan lebih lanjut, silakan hubungi pengelola toko dengan menyertakan Nomor Invoice di atas.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
