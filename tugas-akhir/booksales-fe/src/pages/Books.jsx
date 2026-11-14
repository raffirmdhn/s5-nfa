import { useState, useEffect } from 'react'
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-obsidian">Katalog Buku</h1>
        <p className="text-xs text-stone mt-1">
          Daftar seluruh judul buku yang terhubung langsung dengan backend API.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
            className="px-3 py-2 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian transition-colors cursor-pointer shadow-xs"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-pure-white border border-hairline rounded-md p-4 animate-pulse">
              <div className="h-52 bg-hairline rounded-md mb-3" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
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
                  {book.description && (
                    <p className="text-[11px] text-stone mt-2 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  )}
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
    </div>
  )
}
