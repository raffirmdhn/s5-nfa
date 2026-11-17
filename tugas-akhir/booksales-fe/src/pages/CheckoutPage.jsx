import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import transactionService from '../services/transactionService'
import BookCover from '../components/common/BookCover'
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2, CreditCard, QrCode, Truck, Zap } from 'lucide-react'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  // Periksa apakah ini alur "Beli Sekarang" (hanya satu buku) atau checkout dari keranjang
  const [directItem] = useState(() => {
    if (location.state?.directItem && location.state.directItem.book) {
      return location.state.directItem
    }
    try {
      const saved = sessionStorage.getItem('booksales_direct_buy')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.book) return parsed
      }
    } catch {
      return null
    }
    return null
  })

  const isDirectBuy = Boolean(directItem && directItem.book)

  // Tentukan item yang diproses pada checkout saat ini
  const checkoutItems = isDirectBuy ? [directItem] : cart

  const [formData, setFormData] = useState({
    recipientName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    notes: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [completedOrder, setCompletedOrder] = useState(null)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  const totalCount = checkoutItems.reduce((acc, it) => acc + (it.quantity || 0), 0)
  const subtotal = checkoutItems.reduce(
    (acc, it) => acc + (Number(it.book.price) || 0) * (it.quantity || 0),
    0
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    if (checkoutItems.length === 0) return

    if (!formData.recipientName.trim()) {
      setError('Nama penerima wajib diisi.')
      return
    }
    if (!formData.address.trim()) {
      setError('Alamat pengiriman wajib diisi.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Kirim satu transaksi gabungan (multi-item payload)
      const payload = {
        items: checkoutItems.map((item) => ({
          book_id: item.book.id,
          quantity: item.quantity,
        })),
        recipient_name: formData.recipientName.trim(),
        phone: formData.phone.trim() || null,
        shipping_address: formData.address.trim(),
        notes: formData.notes.trim() || null,
        payment_method: paymentMethod,
      }

      const res = await transactionService.createTransaction(payload)

      // HANYA kosongkan keranjang jika checkout berasal dari keranjang belanja.
      // Jika "Beli Sekarang", keranjang belanja tetap aman dan bersihkan sessionStorage.
      if (!isDirectBuy) {
        clearCart()
      } else {
        sessionStorage.removeItem('booksales_direct_buy')
      }

      setCompletedOrder(res)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Terjadi kesalahan saat memproses pesanan. Pastikan stok buku masih mencukupi.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Tampilan ketika pesanan berhasil selesai
  if (completedOrder) {
    const orderItems = completedOrder.items && completedOrder.items.length > 0
      ? completedOrder.items
      : [
          {
            title: completedOrder.book?.title,
            quantity: completedOrder.quantity,
            price: completedOrder.book?.price,
            subtotal: completedOrder.total_amount,
          },
        ]

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-pure-white border border-hairline rounded-lg p-8 shadow-xs">
          <CheckCircle2 size={48} className="mx-auto text-[#03AC0E] mb-4" />
          <h1 className="text-xl font-bold tracking-tight text-obsidian mb-2">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-xs text-stone mb-6 max-w-md mx-auto leading-relaxed">
            Terima kasih telah berbelanja di BookSales. Transaksi Anda telah tersimpan dengan aman
            dengan status <strong>Pending</strong>.
          </p>

          <div className="bg-paper-white border border-hairline rounded-md p-4 text-left mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-hairline gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone block">
                  Nomor Pesanan
                </span>
                <span className="font-mono text-sm font-bold text-obsidian">
                  {completedOrder.order_number || `BS-${completedOrder.id}`}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone block">
                  Nomor Faktur
                </span>
                <span className="font-mono text-xs font-semibold text-[#03AC0E]">
                  {completedOrder.invoice_code || `INV/BS/${completedOrder.id}`}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone block">
                Buku yang Dipesan ({orderItems.length} Judul · {completedOrder.total_items || completedOrder.quantity} Buku):
              </span>
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-hairline/60 last:border-0">
                  <span className="text-obsidian font-medium">
                    {item.title || 'Judul Buku'} <span className="text-stone">({item.quantity}x)</span>
                  </span>
                  <span className="font-mono text-charcoal">
                    {formatPrice(item.subtotal || item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-hairline text-xs font-semibold">
              <span className="text-obsidian">Total Pembayaran:</span>
              <span className="font-mono font-bold text-obsidian text-sm">
                {formatPrice(completedOrder.total_amount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/invoice/${completedOrder.order_number || completedOrder.id}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium bg-[#03AC0E] text-pure-white rounded-md hover:bg-[#02910c] transition-colors shadow-xs"
            >
              <span>Buka Faktur Resmi</span>
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium bg-obsidian text-pure-white rounded-md hover:bg-carbon transition-colors shadow-xs"
            >
              <span>Lihat Riwayat Transaksi</span>
            </Link>
            <Link
              to="/books"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium bg-paper-white text-obsidian border border-hairline hover:border-smoke rounded-md transition-colors"
            >
              <span>Belanja Buku Lagi</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Jika tidak ada item yang di-checkout
  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-pure-white border border-hairline rounded-lg p-6 shadow-xs">
          <p className="text-xs text-stone mb-4">Tidak ada buku yang dipilih untuk di-checkout.</p>
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="px-4 py-2 text-xs bg-obsidian text-pure-white rounded-md hover:bg-carbon transition-colors cursor-pointer"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link
        to={isDirectBuy && directItem?.book?.id ? `/books/${directItem.book.id}` : '/cart'}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone hover:text-obsidian transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        <span>{isDirectBuy ? 'Batal & Kembali ke Detail Buku' : 'Kembali ke Keranjang'}</span>
      </Link>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-obsidian">Checkout Pesanan</h1>
          <p className="text-xs text-stone mt-1">
            Lengkapi data pengiriman dan pilih metode pembayaran untuk menyelesaikan transaksi.
          </p>
        </div>

        {isDirectBuy && (
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <Zap size={13} className="text-amber-600" />
            <span>Beli Langsung (1 Judul)</span>
          </span>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-paper-white border border-hairline rounded-md text-xs text-obsidian flex items-center gap-2">
          <AlertCircle size={15} className="text-stone shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form Info Pengiriman & Pembayaran */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informasi Pengiriman */}
            <div className="bg-pure-white border border-hairline rounded-lg p-6 shadow-xs">
              <h2 className="text-sm font-semibold text-obsidian mb-4">Informasi Pengiriman</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-obsidian mb-1.5">
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nama lengkap penerima"
                    className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-obsidian mb-1.5">
                    Email Konfirmasi
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@contoh.com"
                    className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-obsidian mb-1.5">
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-obsidian mb-1.5">
                    Alamat Lengkap Pengiriman *
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten, kode pos"
                    className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-obsidian mb-1.5">
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Instruksi khusus pengiriman"
                    className="w-full px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-pure-white border border-hairline rounded-lg p-6 shadow-xs">
              <h2 className="text-sm font-semibold text-obsidian mb-3">Metode Pembayaran</h2>
              <div className="space-y-2.5">
                {[
                  {
                    id: 'bank_transfer',
                    title: 'Transfer Bank Otomatis',
                    desc: 'BCA, Mandiri, BNI, BRI (Verifikasi Instan)',
                    icon: CreditCard,
                  },
                  {
                    id: 'qris',
                    title: 'QRIS / E-Wallet',
                    desc: 'GoPay, OVO, Dana, ShopeePay',
                    icon: QrCode,
                  },
                  {
                    id: 'cod',
                    title: 'Bayar di Tempat (COD)',
                    desc: 'Bayar tunai saat kurir tiba di alamat Anda',
                    icon: Truck,
                  },
                ].map((m) => {
                  const Icon = m.icon
                  const selected = paymentMethod === m.id
                  return (
                    <label
                      key={m.id}
                      className={`flex items-start gap-3 p-3.5 border rounded-md cursor-pointer transition-colors ${
                        selected
                          ? 'border-obsidian bg-hairline/30'
                          : 'border-hairline bg-pure-white hover:border-smoke'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={m.id}
                        checked={selected}
                        onChange={() => setPaymentMethod(m.id)}
                        className="mt-0.5 text-obsidian focus:ring-obsidian"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-obsidian">
                          <Icon size={14} />
                          <span>{m.title}</span>
                        </div>
                        <p className="text-[11px] text-stone mt-0.5">{m.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Ringkasan Pesanan */}
          <div className="lg:col-span-1">
            <div className="bg-pure-white border border-hairline rounded-lg p-5 shadow-xs sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-obsidian">Ringkasan Pesanan</h2>
                <span className="text-[10px] font-mono text-stone bg-paper-white px-2 py-0.5 rounded border border-hairline">
                  {totalCount} item
                </span>
              </div>

              <div className="divide-y divide-hairline max-h-60 overflow-y-auto pr-1 mb-4">
                {checkoutItems.map((item) => (
                  <div key={item.book.id} className="py-2.5 flex items-center gap-3">
                    <div className="w-10 h-14 shrink-0 overflow-hidden rounded border border-hairline">
                      <BookCover
                        src={item.book.cover_photo}
                        title={item.book.title}
                        author={item.book.author?.name}
                        className="w-full h-full text-[7px]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-obsidian line-clamp-1">
                        {item.book.title}
                      </h4>
                      <p className="text-[10px] text-stone">
                        {item.quantity} x {formatPrice(item.book.price)}
                      </p>
                    </div>
                    <div className="text-xs font-mono font-semibold text-obsidian shrink-0">
                      {formatPrice(Number(item.book.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs border-t border-hairline pt-3 pb-4">
                <div className="flex justify-between text-stone">
                  <span>Total Produk</span>
                  <span className="font-mono text-charcoal">{totalCount} item</span>
                </div>
                <div className="flex justify-between text-stone">
                  <span>Ongkos Kirim</span>
                  <span className="text-charcoal font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-obsidian font-semibold pt-2 border-t border-hairline">
                  <span>Total Bayar</span>
                  <span className="text-base font-bold font-mono">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium bg-obsidian text-pure-white hover:bg-carbon disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors shadow-xs cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Memproses Pesanan...</span>
                  </>
                ) : (
                  <span>Konfirmasi & Selesaikan Pesanan</span>
                )}
              </button>

              <p className="text-[10px] text-stone text-center mt-3">
                {isDirectBuy
                  ? 'Item di keranjang belanja Anda akan tetap tersimpan aman.'
                  : 'Setelah pembayaran terkonfirmasi, keranjang belanja akan dikosongkan.'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
