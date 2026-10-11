import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container text-center py-5 my-auto">
      <h1 className="display-4 fw-bold text-secondary mb-2">404</h1>
      <h2 className="h4 fw-semibold mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-muted small mb-4">
        Halaman yang Anda tuju tidak tersedia atau tautan salah.
      </p>
      <Link to="/" className="btn btn-primary btn-sm px-3">
        Kembali ke Halaman Utama
      </Link>
    </div>
  )
}

export default NotFound
