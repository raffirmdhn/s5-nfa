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

  // Update document.title agar ketika pengguna mencetak / menyimpan PDF,
  // browser otomatis menggunakan nama file sesuai kode invoice resmi
  useEffect(() => {
    if (transaction) {
      const prevTitle = document.title
      const invoiceNumber = (transaction.invoice_code || getInvoiceCode(transaction)).replace(/\//g, '-')
      document.title = `Invoice-${invoiceNumber}`

      return () => {
        document.title = prevTitle
      }
    }
  }, [transaction])

  const formatPrice = (price) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0)
    return `Rp.${formatted}`
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
    if (tx.invoice_code) return tx.invoice_code
    const d = tx.created_at ? new Date(tx.created_at) : new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const cleanNumber = (tx.order_number || `BS${tx.id}`).replace(/[^a-zA-Z0-9]/g, '')
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

  // Watermark stempel dinamis mirip Tokopedia (dengan border rounded dan teks stempel miring)
  const renderWatermark = (status) => {
    const s = String(status || 'pending').toLowerCase()
    let text = 'BELUM LUNAS'
    let color = 'border-stone-400/20 text-stone-400/20'

    if (s === 'selesai') {
      text = 'SUDAH LUNAS'
      color = 'border-[#03AC0E]/25 text-[#03AC0E]/25'
    } else if (s === 'dikirim') {
      text = 'DIKIRIM'
      color = 'border-blue-500/25 text-blue-500/25'
    } else if (s === 'diproses') {
      text = 'DIPROSES'
      color = 'border-amber-500/25 text-amber-500/25'
    }

    return (
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
        <div
          className={`transform -rotate-25 border-4 rounded-3xl px-10 py-4 text-4xl sm:text-6xl font-black font-sans tracking-widest uppercase ${color}`}
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
          <p className="text-xs font-mono">Memuat faktur resmi...</p>
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

  const handlePrint = () => {
    if (transaction) {
      const invoiceNumber = (transaction.invoice_code || getInvoiceCode(transaction)).replace(/\//g, '-')
      document.title = `Invoice-${invoiceNumber}`
    }
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 sm:py-10 px-4 print:bg-white print:p-0 print:m-0">
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-end print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors cursor-pointer shadow-xs"
        >
          <Printer size={14} />
          <span>Cetak Faktur / Simpan PDF</span>
        </button>
      </div>

      {/* Invoice Paper Document (Tokopedia style layout) */}
      <div className="max-w-3xl mx-auto bg-white border border-hairline rounded-xl p-8 sm:p-12 shadow-sm relative overflow-hidden print:border-0 print:shadow-none print:p-0 print:max-w-none print:rounded-none">
        {/* Dynamic Watermark Stamp */}
        {renderWatermark(transaction.status)}

        {/* Content Container (Layered above watermark) */}
        <div className="relative z-10 space-y-6">
          {/* Header Brand Tokopedia style */}
          <div className="flex items-center justify-between border-b border-hairline/60 pb-5">
            <div className="flex items-center gap-2">
              <span className="text-[#03AC0E] font-extrabold text-2xl tracking-tight font-sans">
                booksales
              </span>
            </div>
            <span className="text-[11px] font-mono text-stone uppercase tracking-widest">
              {transaction.order_number || `BS-${transaction.id}`}
            </span>
          </div>

          {/* Metadata Grid (Tokopedia style: aligned labels and values, no line wrapping) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs text-charcoal pt-1">
            {/* Left: Nomor Invoice & Tanggal */}
            <table className="border-collapse text-xs w-full">
              <tbody>
                <tr>
                  <td className="py-1 pr-2 text-stone whitespace-nowrap align-top w-28 font-medium">Nomor Invoice</td>
                  <td className="py-1 px-1 text-stone align-top w-3">:</td>
                  <td className="py-1 text-[#03AC0E] font-mono font-bold whitespace-nowrap align-top">
                    {getInvoiceCode(transaction)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-stone whitespace-nowrap align-top font-medium">Tanggal</td>
                  <td className="py-1 px-1 text-stone align-top">:</td>
                  <td className="py-1 text-obsidian align-top">
                    {formatDate(transaction.created_at)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-stone whitespace-nowrap align-top font-medium">Pembayaran</td>
                  <td className="py-1 px-1 text-stone align-top">:</td>
                  <td className="py-1 text-obsidian align-top">
                    {getPaymentLabel(transaction.payment_method)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Right: Kepada & Alamat */}
            <table className="border-collapse text-xs w-full">
              <tbody>
                <tr>
                  <td className="py-1 pr-2 text-stone whitespace-nowrap align-top w-16 font-medium">Kepada</td>
                  <td className="py-1 px-1 text-stone align-top w-3">:</td>
                  <td className="py-1 text-obsidian font-semibold align-top">
                    {transaction.recipient_name || transaction.customer?.name || 'Pelanggan'}
                  </td>
                </tr>
                {transaction.phone && (
                  <tr>
                    <td className="py-1 pr-2 text-stone whitespace-nowrap align-top font-medium">Telepon</td>
                    <td className="py-1 px-1 text-stone align-top">:</td>
                    <td className="py-1 text-obsidian font-mono align-top">
                      {transaction.phone}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-1 pr-2 text-stone whitespace-nowrap align-top font-medium">Alamat</td>
                  <td className="py-1 px-1 text-stone align-top">:</td>
                  <td className="py-1 text-charcoal leading-relaxed align-top">
                    {transaction.shipping_address || 'Ambil di Toko / Alamat Tidak Dicantumkan'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Section: Nama Produk & Jumlah (IDR) like Tokopedia */}
          <div className="border-t border-hairline/80 pt-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-hairline bg-[#F9FAFB] text-obsidian font-bold">
                    <th className="py-2.5 px-4 text-left">Nama Produk</th>
                    <th className="py-2.5 px-4 text-right">Jumlah (IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {(transaction.items && transaction.items.length > 0
                    ? transaction.items
                    : [
                        {
                          id: transaction.id,
                          title: transaction.book?.title,
                          author: transaction.book?.author?.name,
                          quantity: transaction.quantity,
                          price: transaction.book?.price,
                          subtotal: transaction.total_amount,
                          notes: transaction.notes,
                        },
                      ]
                  ).map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-obsidian text-xs">
                          {item.title || 'Judul Buku'}
                        </div>
                        <div className="text-[11px] text-stone mt-0.5">
                          Penulis: {item.author || 'Penulis Tidak Diketahui'} · {item.quantity} x {formatPrice(item.price || 0)}
                        </div>
                        {item.notes && (
                          <div className="text-[10px] text-stone mt-1 italic">
                            Catatan: {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-obsidian whitespace-nowrap">
                        {formatPrice(item.subtotal || ((item.price || 0) * (item.quantity || 1)))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown (Tokopedia Style) */}
            <div className="mt-4 flex flex-col items-end space-y-2 text-xs">
              <div className="w-full sm:w-80 flex justify-between py-1 border-t border-hairline text-stone">
                <span className="font-semibold text-obsidian">Subtotal</span>
                <span className="font-mono font-bold text-obsidian">
                  {formatPrice(transaction.total_amount)}
                </span>
              </div>

              <div className="w-full sm:w-80 flex justify-between py-1 text-stone">
                <span>Biaya Layanan Bebas Ongkir</span>
                <span className="font-mono text-obsidian">Rp.0,00</span>
              </div>

              {/* Tokopedia Highlighted Total Bayar Box */}
              <div className="w-full sm:w-80 border-2 border-hairline rounded-md p-3 flex justify-between items-center bg-white shadow-xs">
                <span className="text-xs font-bold text-obsidian uppercase tracking-wider">
                  Total Bayar
                </span>
                <span className="text-base font-extrabold font-mono text-obsidian">
                  {formatPrice(transaction.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Important Information Section */}
          <div className="border-t border-hairline/80 pt-6 text-[11px] text-stone space-y-1.5 leading-relaxed">
            <p className="font-semibold text-obsidian">Informasi Penting:</p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
              <li>Invoice ini berfungsi sebagai tanda terima pembayaran yang sah.</li>
              <li>
                Diterbitkan secara elektronik oleh sistem <strong>BookSales · STT Terpadu Nurul Fikri</strong>.
              </li>
              <li>
                Dalam hal terdapat pertanyaan mengenai invoice ini, silakan hubungi pengelola toko BookSales dengan menyertakan Nomor Invoice di atas.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
