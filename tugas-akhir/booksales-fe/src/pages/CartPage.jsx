import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import BookCover from '../components/common/BookCover'
import { Trash2, ArrowLeft, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart()
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  const subtotal = getCartTotal()
  const totalCount = getCartCount()

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="p-10 bg-pure-white border border-hairline rounded-lg max-w-md mx-auto shadow-xs">
          <ShoppingBag size={40} className="mx-auto text-ash mb-3" />
          <h2 className="text-base font-semibold text-obsidian mb-1">Keranjang Belanja Kosong</h2>
          <p className="text-xs text-stone mb-6">
            Anda belum menambahkan buku apa pun ke dalam keranjang belanja.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-obsidian text-pure-white rounded-md hover:bg-carbon transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Jelajahi Katalog Buku</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-obsidian">Keranjang Belanja</h1>
          <p className="text-xs text-stone mt-1">
            Terdapat {totalCount} buku di dalam keranjang belanja Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-stone hover:text-obsidian transition-colors underline cursor-pointer"
        >
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-pure-white border border-hairline rounded-lg divide-y divide-hairline shadow-xs">
            {cart.map((item) => {
              const book = item.book
              const lineTotal = Number(book.price || 0) * item.quantity
              const maxStock = Number(book.stock || 0)

              return (
                <div key={book.id} className="p-4 sm:p-5 flex gap-4 items-center">
                  <div className="w-16 h-22 shrink-0 overflow-hidden rounded border border-hairline">
                    <BookCover
                      src={book.cover_photo}
                      title={book.title}
                      author={book.author?.name}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/books/${book.id}`}
                      className="text-sm font-semibold text-obsidian hover:text-charcoal transition-colors line-clamp-1"
                    >
                      {book.title}
                    </Link>
                    <p className="text-xs text-stone mt-0.5">
                      {book.author?.name || 'Penulis Tidak Diketahui'}
                    </p>
                    <div className="text-xs font-mono font-medium text-obsidian mt-1.5">
                      {formatPrice(book.price)}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 border border-hairline rounded-md px-1 py-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(book.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1 text-charcoal hover:text-obsidian disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Kurangi"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-xs font-mono font-semibold text-obsidian">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(book.id, item.quantity + 1)}
                      disabled={item.quantity >= maxStock}
                      className="p-1 text-charcoal hover:text-obsidian disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Tambah"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="text-right shrink-0 min-w-24">
                    <div className="text-xs font-bold font-mono text-obsidian">
                      {formatPrice(lineTotal)}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(book.id)}
                      className="mt-1 text-stone hover:text-obsidian transition-colors p-1"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/books"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone hover:text-obsidian transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Lanjut Belanja Buku Lain</span>
            </Link>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-pure-white border border-hairline rounded-lg p-5 shadow-xs sticky top-20">
            <h2 className="text-sm font-semibold text-obsidian mb-4">Ringkasan Belanja</h2>

            <div className="space-y-2.5 text-xs border-b border-hairline pb-4">
              <div className="flex justify-between text-stone">
                <span>Total Item</span>
                <span className="font-mono text-charcoal">{totalCount} buku</span>
              </div>
              <div className="flex justify-between text-stone">
                <span>Subtotal</span>
                <span className="font-mono text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone">
                <span>Biaya Pengiriman</span>
                <span className="text-charcoal font-medium">Gratis</span>
              </div>
            </div>

            <div className="pt-4 mb-6 flex justify-between items-baseline">
              <span className="text-xs font-semibold text-obsidian">Total Pembayaran</span>
              <span className="text-lg font-bold font-mono text-obsidian">
                {formatPrice(subtotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium bg-obsidian text-pure-white hover:bg-carbon rounded-md transition-colors shadow-xs cursor-pointer"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight size={14} />
            </button>

            <p className="text-[11px] text-stone text-center mt-4">
              Transaksi aman dan tercatat langsung ke sistem backend API.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
