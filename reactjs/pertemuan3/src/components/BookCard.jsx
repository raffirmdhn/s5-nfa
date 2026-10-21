import { useState } from 'react'

function BookCard({ book }) {
  const [imgError, setImgError] = useState(false)
  const hasValidImage = Boolean(book?.image) && !imgError

  return (
    <div className="card h-100 book-card">
      <div className="book-card-cover-wrapper">
        {hasValidImage ? (
          <img
            src={book.image}
            alt={book?.title || 'Cover Buku'}
            className="book-card-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="book-cover-fallback">
            <i className="bi bi-book fs-1 mb-2 text-secondary"></i>
            <span className="small fw-semibold text-truncate w-100 px-2 text-dark">
              {book?.title || 'Tanpa Judul'}
            </span>
            <small className="text-muted">{book?.year || '-'}</small>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge text-bg-light border text-secondary fw-normal">
            Tahun {book?.year || '-'}
          </span>
          <span className="badge text-bg-light border text-muted fw-normal">
            #{book?.id || '-'}
          </span>
        </div>

        <h5 className="card-title fw-bold mb-1 text-truncate" title={book?.title || 'Tanpa Judul'}>
          {book?.title || 'Tanpa Judul'}
        </h5>

        <p className="card-subtitle text-muted mb-2 small">
          <i className="bi bi-person me-1"></i>
          {book?.author || 'Penulis Anonim'}
        </p>

        <p className="card-text book-description flex-grow-1 mb-0">
          {book?.description || 'Tidak ada deskripsi tersedia.'}
        </p>
      </div>

      <div className="card-footer bg-transparent border-top p-3 pt-2 pb-2 d-flex justify-content-between align-items-center">
        <small className="text-muted">Status</small>
        <span className="badge text-bg-success-subtle text-success border border-success-subtle">
          Tersedia
        </span>
      </div>
    </div>
  )
}

export default BookCard
