import { Link } from 'react-router-dom'
import BookCard from './BookCard'

function Home({ books = [] }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white border-bottom py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 fs-6">
                <i className="bi bi-star-fill me-1 text-warning"></i> Pertemuan 3 &bull; React Hooks & List Rendering
              </span>
              <h1 className="display-5 fw-bold text-dark lh-sm mb-3">
                Katalog Buku Pemrograman & Teknologi Modern
              </h1>
              <p className="lead text-muted mb-4 fs-6">
                Selamat datang di <strong>BookSales</strong>. Platform referensi buku teknologi untuk mahasiswa STT Terpadu Nurul Fikri dalam menguasai pemrograman web, mobile, dan data science.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/book" className="btn btn-primary btn-lg fs-6 px-4">
                  <i className="bi bi-collection me-2"></i> Buka Halaman Book
                </Link>
                <a href="#koleksi-buku" className="btn btn-outline-secondary btn-lg fs-6 px-4">
                  <i className="bi bi-arrow-down-circle me-2"></i> Lihat Daftar
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&auto=format&fit=crop&q=80"
                alt="Book Collection"
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: '380px', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Highlights */}
      <section className="py-4 bg-light border-bottom">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3 bg-white rounded-3 shadow-sm border">
                <h3 className="fw-bold text-primary mb-0">{books.length}</h3>
                <small className="text-muted">Total Judul Buku</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-white rounded-3 shadow-sm border">
                <h3 className="fw-bold text-success mb-0">100%</h3>
                <small className="text-muted">Bahasa Indonesia</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-white rounded-3 shadow-sm border">
                <h3 className="fw-bold text-info mb-0">Hooks</h3>
                <small className="text-muted">State Management</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 bg-white rounded-3 shadow-sm border">
                <h3 className="fw-bold text-warning mb-0">Array.map()</h3>
                <small className="text-muted">Dynamic Render</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Display Section */}
      <section id="koleksi-buku" className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="fw-bold mb-1">Daftar Buku di Halaman Home</h2>
            <p className="text-muted mb-0">
              Menampilkan {books.length} koleksi buku menggunakan metode <code>map()</code>
            </p>
          </div>
          <Link to="/book" className="btn btn-outline-primary btn-sm">
            Kelola di Halaman Book <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
          {books.map((book) => (
            <div className="col" key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
