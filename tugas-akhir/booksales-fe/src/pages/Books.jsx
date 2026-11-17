import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookService from '../services/bookService'
import genreService from '../services/genreService'
import BookCover from '../components/common/BookCover'
import { BookOpen, Search, Filter } from 'lucide-react'

export default function Books() {
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [booksData, genresData] = await Promise.allSettled([
          bookService.getBooks(),
          genreService.getGenres(),
        ])
        if (booksData.status === 'fulfilled') setBooks(booksData.value)
        if (genresData.status === 'fulfilled') setGenres(genresData.value)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredBooks = books.filter((book) => {
    const matchSearch =
      book.title?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.name?.toLowerCase().includes(search.toLowerCase())
    const matchGenre =
      selectedGenre === 'all' ||
      String(book.genre_id) === String(selectedGenre) ||
      book.genre?.name === selectedGenre
    return matchSearch && matchGenre
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian">Katalog Buku</h1>
        <p className="text-xs text-stone mt-1">
          Daftar seluruh judul buku yang terhubung langsung dengan backend API.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-6 sm:mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul buku atau nama penulis..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors shadow-xs"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-stone pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-stone hidden sm:block" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian transition-colors cursor-pointer shadow-xs"
          >
            <option value="all">Semua Genre ({books.length})</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-pure-white border border-hairline rounded-md p-3 sm:p-4 animate-pulse">
              <div className="h-40 sm:h-52 bg-hairline rounded-md mb-3" />
              <div className="h-4 bg-hairline rounded mb-2 w-3/4" />
              <div className="h-3 bg-hairline rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-pure-white border border-hairline rounded-md text-stone">
          <BookOpen size={32} className="mx-auto mb-2 text-ash" />
          <p className="font-medium text-charcoal">Tidak ada buku yang cocok</p>
          <p className="text-xs mt-1">Coba gunakan filter genre atau kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5 lg:gap-6">
          {filteredBooks.map((book) => (
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
                  {book.description && (
                    <p className="text-[10px] sm:text-[11px] text-stone mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">
                      {book.description}
                    </p>
                  )}
                </div>
                <div className="pt-2.5 sm:pt-3 mt-3 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-xs sm:text-xs font-bold text-obsidian font-mono">
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
    </div>
  )
}
