import { Link } from 'react-router-dom'
import BookCard from './BookCard'

function Home({ books = [] }) {
  return (
    <div className="container my-5">
      <div className="p-4 p-md-5 mb-4 bg-white border rounded">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <h1 className="fw-bold text-dark mb-2">
              Katalog Buku Pemrograman
            </h1>
            <p className="text-secondary mb-4">
              Aplikasi katalog buku praktikum React JS Pertemuan 3. Menampilkan daftar koleksi buku referensi pemrograman web, mobile, dan data science menggunakan rendering list dinamis.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/book" className="btn btn-primary px-3">
                <i className="bi bi-journal-bookmark me-2"></i>
                Kelola Koleksi Buku
              </Link>
              <a href="#koleksi-buku" className="btn btn-outline-secondary px-3">
                Lihat Daftar Buku
              </a>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bg-light p-3 rounded border">
              <h6 className="fw-semibold text-dark mb-2">Informasi Praktikum</h6>
              <ul className="list-unstyled mb-0 small text-secondary">
                <li className="mb-1"><strong>Mahasiswa:</strong> Raffi Ramadhan</li>
                <li className="mb-1"><strong>NIM:</strong> 0110224204</li>
                <li className="mb-1"><strong>Mata Kuliah:</strong> Pemrograman Web</li>
                <li><strong>Total Koleksi:</strong> {books.length} buku</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <section id="koleksi-buku" className="pt-2">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 fw-bold mb-1">Daftar Koleksi Buku</h2>
            <p className="text-muted small mb-0">
              Menampilkan {books.length} judul buku yang tersimpan di sistem
            </p>
          </div>
          <Link to="/book" className="btn btn-outline-primary btn-sm">
            Tambah Buku Baru
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
