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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero Section */}
      <section className="text-center py-16 sm:py-24 border-b border-hairline">
        <div className="inline-block px-3 py-1 rounded-full bg-paper-white border border-hairline text-stone text-xs font-mono mb-6">
          Praktikum ReactJS Lanjutan · STT Terpadu Nurul Fikri
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-obsidian max-w-3xl mx-auto leading-tight">
          Katalog Buku BookSales
        </h1>

        <p className="mt-5 text-sm sm:text-base text-stone max-w-xl mx-auto leading-relaxed">
          Temukan berbagai koleksi buku menarik dari beragam kategori dan penulis pilihan.
        </p>

        <div className="mt-8 flex items-center justify-center">
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
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-obsidian">Buku Pilihan</h2>
            <p className="text-xs text-stone mt-1">Koleksi buku terbaru yang terdaftar dalam sistem.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-pure-white border border-hairline rounded-md p-4 animate-pulse">
                <div className="h-52 bg-hairline rounded-md mb-3" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-pure-white border border-hairline rounded-md overflow-hidden hover:border-smoke hover:shadow-md transition-all flex flex-col"
              >
                <BookCover
                  src={book.cover_photo}
                  title={book.title}
                  author={book.author?.name}
                  className="h-52"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {book.genre?.name && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone mb-1.5 block">
                        {book.genre.name}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-obsidian line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-charcoal mt-0.5">
                      {book.author?.name || 'Penulis Tidak Diketahui'}
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-hairline flex items-center justify-between">
                    <span className="text-xs font-semibold text-obsidian">
                      {formatPrice(book.price)}
                    </span>
                    <span className="text-[10px] font-mono text-stone bg-paper-white px-2 py-0.5 rounded border border-hairline">
                      Stok: {book.stock ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
