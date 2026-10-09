import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container my-5 py-5 text-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="mb-3">Halaman Tidak Ditemukan</h2>
        <p className="text-muted mb-4">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link to="/" className="btn btn-primary px-4 py-2">
          <i className="bi bi-house-door me-2"></i>Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

export default NotFound
