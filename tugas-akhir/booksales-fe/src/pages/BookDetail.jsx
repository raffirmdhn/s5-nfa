import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import bookService from '../services/bookService'
import { useCart } from '../context/CartContext'
import BookCover from '../components/common/BookCover'
import { ArrowLeft, ShoppingCart, Check, AlertCircle, Plus, Minus, Tag, User } from 'lucide-react'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    async function loadBook() {
      setLoading(true)
      setError('')
      try {
        const data = await bookService.getBookById(id)
        if (!data) {
          setError('Buku tidak ditemukan.')
        } else {
          setBook(data)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat informasi buku.')
      } finally {
        setLoading(false)
      }
    }
    loadBook()
  }, [id])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  const handleQuantityChange = (delta) => {
    if (!book) return
    const maxStock = Number(book.stock || 0)
    const next = quantity + delta
    if (next >= 1 && next <= maxStock) {
      setQuantity(next)
    }
  }

  const handleAddToCart = () => {
    if (!book) return
    const result = addToCart(book, quantity)
    if (result.success) {
      setFeedback({ type: 'success', message: result.message })
    } else {
      setFeedback({ type: 'error', message: result.message })
    }

    setTimeout(() => {
      setFeedback({ type: '', message: '' })
    }, 3500)
  }

  const handleBuyNow = () => {
    if (!book) return
    if (Number(book.stock || 0) <= 0) {
      setFeedback({ type: 'error', message: 'Stok buku ini sedang habis.' })
      return
    }

    try {
      sessionStorage.setItem(
        'booksales_direct_buy',
        JSON.stringify({
          book,
          quantity,
        })
      )
    } catch {
      // ignore
    }

    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-6 bg-hairline rounded w-32 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-pure-white border border-hairline rounded-lg p-6 animate-pulse">
          <div className="h-96 bg-hairline rounded" />
          <div className="space-y-4">
            <div className="h-5 bg-hairline rounded w-1/4" />
            <div className="h-8 bg-hairline rounded w-3/4" />
            <div className="h-4 bg-hairline rounded w-1/2" />
            <div className="h-20 bg-hairline rounded w-full pt-4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="p-8 bg-pure-white border border-hairline rounded-lg max-w-md mx-auto">
          <AlertCircle size={36} className="mx-auto text-stone mb-3" />
          <h2 className="text-base font-semibold text-obsidian mb-1">Buku Tidak Ditemukan</h2>
          <p className="text-xs text-stone mb-6">{error || 'Data buku tidak tersedia dalam sistem.'}</p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-obsidian text-pure-white rounded-md hover:bg-carbon transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = Number(book.stock || 0) <= 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Link
        to="/books"
        className="inline-flex items-center gap-1.5 text-xs text-stone hover:text-obsidian transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={14} />
        <span>Kembali ke Katalog</span>
      </Link>

      {feedback.message && (
        <div
          className={`mb-6 p-3 rounded-md text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-paper-white text-obsidian border-hairline'
              : 'bg-paper-white text-stone border-hairline'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <Check size={14} className="text-terminal-green" />
            ) : (
              <AlertCircle size={14} className="text-stone" />
            )}
            <span>{feedback.message}</span>
          </div>
          {feedback.type === 'success' && (
            <Link
              to="/cart"
              className="font-semibold underline ml-4 hover:text-charcoal"
            >
              Lihat Keranjang
            </Link>
          )}
        </div>
      )}

      <div className="bg-pure-white border border-hairline rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Book Cover */}
          <div className="flex justify-center items-start">
            <div className="w-full max-w-xs overflow-hidden rounded-md border border-hairline shadow-sm">
              <BookCover
                src={book.cover_photo}
                title={book.title}
                author={book.author?.name}
                className="h-96 w-full"
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {book.genre?.name && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-charcoal bg-paper-white px-2 py-0.5 rounded border border-hairline">
                    <Tag size={11} />
                    {book.genre.name}
                  </span>
                )}
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    isOutOfStock
                      ? 'bg-paper-white text-stone border-hairline'
                      : 'bg-paper-white text-charcoal border-hairline'
                  }`}
                >
                  {isOutOfStock ? 'Stok Habis' : `Stok: ${book.stock}`}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-obsidian mb-2">{book.title}</h1>

              <div className="flex items-center gap-1.5 text-xs text-charcoal mb-4">
                <User size={13} className="text-stone" />
                <span>Penulis:</span>
                <span className="font-semibold text-obsidian">{book.author?.name || 'Anonim'}</span>
              </div>

              <div className="py-3 border-y border-hairline my-4">
                <span className="text-xs text-stone block mb-0.5">Harga</span>
                <span className="text-2xl font-bold tracking-tight text-obsidian font-mono">
                  {formatPrice(book.price)}
                </span>
              </div>

              <div className="mt-4 mb-6">
                <h3 className="text-xs font-semibold text-obsidian uppercase tracking-wider mb-2">
                  Sinopsis / Deskripsi
                </h3>
                <p className="text-xs text-charcoal leading-relaxed whitespace-pre-line">
                  {book.description || 'Tidak ada deskripsi rinci untuk buku ini.'}
                </p>
              </div>
            </div>

            {/* Purchase Controls */}
            <div className="pt-6 border-t border-hairline space-y-4">
              {!isOutOfStock ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-obsidian">Jumlah:</span>
                    <div className="flex items-center border border-hairline rounded-md">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-1.5 text-charcoal hover:text-obsidian disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Kurangi"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-mono font-semibold text-obsidian">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= Number(book.stock || 0)}
                        className="p-1.5 text-charcoal hover:text-obsidian disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Tambah"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-[11px] text-stone">Maks. {book.stock}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium bg-paper-white text-obsidian border border-hairline hover:border-smoke rounded-md transition-colors shadow-xs cursor-pointer"
                    >
                      <ShoppingCart size={14} />
                      <span>Tambah ke Keranjang</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium bg-obsidian text-pure-white hover:bg-carbon rounded-md transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Beli Sekarang</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-3 bg-paper-white border border-hairline rounded-md text-center text-xs text-stone">
                  Mohon maaf, stok buku ini saat ini sedang habis.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
