import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookService from '../services/bookService'
import BookCover from '../components/common/BookCover'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await bookService.getBooks()
        setBooks(data.slice(0, 4))
      } catch {
        setBooks([])
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="text-center py-12 sm:py-20 border-b border-hairline">
        <div className="inline-block px-3 py-1 rounded-full bg-paper-white border border-hairline text-stone text-xs font-mono mb-6">
          Praktikum ReactJS Lanjutan · STT Terpadu Nurul Fikri
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-obsidian max-w-4xl mx-auto leading-tight">
          Katalog Buku BookSales
        </h1>

        <p className="mt-4 sm:mt-5 text-xs sm:text-base text-stone max-w-xl mx-auto leading-relaxed">
          Temukan berbagai koleksi buku menarik dari beragam kategori dan penulis pilihan.
        </p>

        <div className="mt-6 sm:mt-8 flex items-center justify-center">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors shadow-xs"
          >
            <span>Jelajahi Katalog Buku</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-obsidian">Buku Pilihan</h2>
            <p className="text-xs text-stone mt-0.5">Koleksi buku terbaru yang terdaftar dalam sistem.</p>
          </div>
          <Link
            to="/books"
            className="text-xs font-medium text-charcoal hover:text-obsidian inline-flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-pure-white border border-hairline rounded-md p-3 sm:p-4 animate-pulse">
                <div className="h-44 sm:h-52 bg-hairline rounded-md mb-3" />
                <div className="h-4 bg-hairline rounded mb-2 w-3/4" />
                <div className="h-3 bg-hairline rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 bg-pure-white border border-hairline rounded-md text-stone">
            <BookOpen size={28} className="mx-auto mb-2 text-ash" />
            <p className="text-xs">Belum ada buku yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="group bg-pure-white border border-hairline rounded-md overflow-hidden hover:border-smoke hover:shadow-md transition-all flex flex-col"
              >
                <BookCover
                  src={book.cover_photo}
                  title={book.title}
                  author={book.author?.name}
                  className="h-44 sm:h-52 group-hover:scale-[1.02] transition-transform duration-200"
                />
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {book.genre?.name && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone mb-1 block truncate">
                        {book.genre.name}
                      </span>
                    )}
                    <h3 className="text-xs sm:text-sm font-semibold text-obsidian line-clamp-1 group-hover:text-charcoal transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-charcoal mt-0.5 line-clamp-1">
                      {book.author?.name || 'Penulis Tidak Diketahui'}
                    </p>
                  </div>
                  <div className="pt-2.5 sm:pt-3 mt-3 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-obsidian font-mono">
                      {formatPrice(book.price)}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-stone bg-paper-white px-1.5 py-0.5 rounded border border-hairline self-start sm:self-auto">
                      Stok: {book.stock ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
