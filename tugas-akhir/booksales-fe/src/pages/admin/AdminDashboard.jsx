import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import genreService from '../../services/genreService'
import authorService from '../../services/authorService'
import bookService from '../../services/bookService'
import { Bookmark, Users, BookOpen, ArrowUpRight, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    genres: 0,
    authors: 0,
    books: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [genres, authors, books] = await Promise.allSettled([
          genreService.getGenres(),
          authorService.getAuthors(),
          bookService.getBooks(),
        ])
        setStats({
          genres: genres.status === 'fulfilled' ? genres.value.length : 0,
          authors: authors.status === 'fulfilled' ? authors.value.length : 0,
          books: books.status === 'fulfilled' ? books.value.length : 0,
        })
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const cards = [
    {
      title: 'Total Genre',
      count: stats.genres,
      link: '/admin/genres',
      icon: Bookmark,
      desc: 'Kategori dan klasifikasi buku',
    },
    {
      title: 'Total Penulis',
      count: stats.authors,
      link: '/admin/authors',
      icon: Users,
      desc: 'Penulis dan kontributor terdaftar',
    },
    {
      title: 'Total Buku',
      count: stats.books,
      link: '/books',
      icon: BookOpen,
      desc: 'Koleksi judul buku dalam katalog',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-obsidian">Dashboard Administrator</h1>
        <p className="text-xs text-stone mt-1">
          Ringkasan data master untuk platform toko buku BookSales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.title}
              className="p-5 bg-pure-white border border-hairline rounded-lg shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-stone mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider">{c.title}</span>
                  <Icon size={16} />
                </div>
                <div className="text-3xl font-bold tracking-tight text-obsidian mb-1">
                  {loading ? '—' : c.count}
                </div>
                <p className="text-xs text-stone">{c.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-hairline">
                <Link
                  to={c.link}
                  className="inline-flex items-center gap-1 text-xs font-medium text-obsidian hover:text-charcoal transition-colors"
                >
                  <span>Kelola data</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Action Info Card */}
      <div className="p-6 bg-pure-white border border-hairline rounded-lg shadow-xs">
        <h2 className="text-sm font-semibold text-obsidian mb-2">Aksi Cepat</h2>
        <p className="text-xs text-stone mb-4 max-w-xl leading-relaxed">
          Tugas ReactJS Lanjutan Pertemuan 1 berfokus pada fitur <strong>Read</strong> dan <strong>Create</strong> data Genre dan Author. Anda dapat langsung mengelola kedua data master tersebut melalui tab navigasi di atas.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/genres"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-obsidian text-pure-white hover:bg-carbon rounded-md transition-colors"
          >
            <Plus size={13} />
            <span>Kelola & Tambah Genre</span>
          </Link>
          <Link
            to="/admin/authors"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-paper-white text-obsidian border border-hairline hover:border-smoke rounded-md transition-colors"
          >
            <Plus size={13} />
            <span>Kelola & Tambah Penulis</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
