import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container text-center my-auto py-5">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h3 className="fw-semibold mb-3">Halaman Tidak Ditemukan</h3>
        <p className="text-muted mb-4">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <Link to="/" className="btn btn-primary px-4">
          <i className="bi bi-house-door me-2"></i> Kembali ke Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
