function BookCard({ book }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60'

  return (
    <div className="card h-100 book-card shadow-sm">
      <img
        src={book.image || fallbackImage}
        alt={book.title}
        className="card-img-top book-card-img"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = fallbackImage
        }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
            {book?.year || '-'}
          </span>
          <small className="text-muted">ID: #{book?.id || '-'}</small>
        </div>
        <h5 className="card-title fw-bold mb-1 text-truncate" title={book?.title || 'Tanpa Judul'}>
          {book?.title || 'Tanpa Judul'}
        </h5>
        <p className="card-subtitle text-muted mb-3 small">
          <i className="bi bi-person me-1"></i>
          {book?.author || 'Penulis Anonim'}
        </p>
        <p className="card-text book-description flex-grow-1">
          {book?.description || 'Tidak ada deskripsi.'}
        </p>
      </div>
      <div className="card-footer bg-transparent border-top-0 pt-0 pb-3">
        <button type="button" className="btn btn-outline-primary btn-sm w-100">
          <i className="bi bi-book me-1"></i> Detail Buku
        </button>
      </div>
    </div>
  )
}

export default BookCard
