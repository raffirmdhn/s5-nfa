import { useState } from 'react'
import BookCard from './BookCard'

function Book({ books = [], onAddBook }) {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    description: '',
    image: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.author.trim()) {
      alert('Judul buku dan nama penulis wajib diisi!')
      return
    }

    const newBook = {
      id: Date.now(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      year: Number(formData.year) || new Date().getFullYear(),
      description: formData.description.trim() || 'Buku referensi pemrograman.',
      image: formData.image.trim()
    }

    if (onAddBook) {
      onAddBook(newBook)
    }

    setFormData({
      title: '',
      author: '',
      year: new Date().getFullYear(),
      description: '',
      image: ''
    })
    setShowForm(false)
    setAlertMessage(`Buku "${newBook.title}" berhasil ditambahkan ke koleksi.`)

    setTimeout(() => {
      setAlertMessage('')
    }, 4000)
  }

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase()
    const title = (book?.title || '').toLowerCase()
    const author = (book?.author || '').toLowerCase()
    const year = String(book?.year || '')
    return title.includes(query) || author.includes(query) || year.includes(query)
  })

  return (
    <div className="container my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 mb-4 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">Manajemen Koleksi Buku</h1>
          <p className="text-secondary small mb-0">
            Daftar buku dengan rendering list dinamis dan pengelolaan state menggunakan React Hooks.
          </p>
        </div>
        <div>
          <button
            type="button"
            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} btn-sm px-3`}
            onClick={() => setShowForm(!showForm)}
          >
            <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-1`}></i>
            {showForm ? 'Tutup Form' : 'Tambah Buku'}
          </button>
        </div>
      </div>

      {alertMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlertMessage('')}
            aria-label="Tutup"
          ></button>
        </div>
      )}

      {showForm && (
        <div className="card border mb-4">
          <div className="card-header bg-light py-2">
            <span className="fw-semibold small text-dark">Formulir Tambah Buku</span>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="title" className="form-label small fw-medium">
                    Judul Buku <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    placeholder="Contoh: Belajar React Modern"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="author" className="form-label small fw-medium">
                    Penulis <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    className="form-control"
                    placeholder="Nama penulis"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="year" className="form-label small fw-medium">
                    Tahun Terbit
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    className="form-control"
                    min="1990"
                    max="2030"
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="image" className="form-label small fw-medium">
                    URL Cover Buku (Opsional)
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    className="form-control"
                    placeholder="https://... (kosongkan jika tidak ada)"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="description" className="form-label small fw-medium">
                    Deskripsi Ringkas
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Sinopsis singkat mengenai isi buku..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="col-12 text-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => setShowForm(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-3">
                    Simpan Data Buku
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-3 align-items-center mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Cari berdasarkan judul, penulis, atau tahun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchQuery('')}
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="col-md-6 text-md-end text-muted small">
          Menampilkan {filteredBooks.length} dari total {books.length} buku
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
          {filteredBooks.map((book) => (
            <div className="col" key={book.id}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded border">
          <i className="bi bi-search fs-2 text-muted mb-2 d-block"></i>
          <p className="fw-semibold mb-1 text-dark">Buku tidak ditemukan</p>
          <small className="text-muted">Tidak ada buku yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;</small>
        </div>
      )}
    </div>
  )
}

export default Book
