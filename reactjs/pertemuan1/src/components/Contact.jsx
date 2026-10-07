import { useState } from 'react'

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [senderName, setSenderName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const nameInput = e.target.elements.name.value
    setSenderName(nameInput)
    setSubmitted(true)
    e.target.reset()
  }

  const faqs = [
    {
      id: 'faqOne',
      question: 'Apakah website ini sudah sepenuhnya responsif?',
      answer: 'Ya, tampilan website ini sudah memanfaatkan sistem grid dan utility class dari Bootstrap 5 sehingga dapat menyesuaikan dengan optimal di layar smartphone, tablet, maupun desktop.'
    },
    {
      id: 'faqTwo',
      question: 'Teknologi apa saja yang digunakan pada proyek tugas ini?',
      answer: 'Proyek ini dibangun menggunakan React JS (Vite), JavaScript modern (ES6+), framework CSS Bootstrap 5, serta Bootstrap Icons.'
    },
    {
      id: 'faqThree',
      question: 'Bagaimana alur navigasi antar halaman pada website ini?',
      answer: 'Navigasi menggunakan teknik conditional rendering berbasis State pada React sehingga perpindahan halaman berlangsung instan tanpa reload browser (Single Page Application).'
    }
  ]

  return (
    <div className="container my-5 py-3">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Kontak Kami</h2>
        <p className="text-muted">Silakan hubungi kami melalui form atau informasi di bawah ini.</p>
      </div>

      {/* Main 2-Column Section */}
      <div className="row g-4 mb-5 pb-4 border-bottom">
        <div className="col-md-5">
          <div className="card h-100 border p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Informasi Kampus & Kontak</h5>
            <div className="mb-3">
              <span className="text-muted small d-block">Kampus</span>
              <strong>STT Terpadu Nurul Fikri</strong>
            </div>
            <div className="mb-3">
              <span className="text-muted small d-block">Alamat</span>
              <span>Jl. Raya Lenteng Agung No. 20, Jagakarsa, Jakarta Selatan</span>
            </div>
            <div className="mb-3">
              <span className="text-muted small d-block">Email Mahasiswa</span>
              <span>raffi.ramadhan@student.nurulfikri.ac.id</span>
            </div>
            <div>
              <span className="text-muted small d-block">WhatsApp / No. HP</span>
              <span>0812-3456-7890</span>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card border p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Kirim Pesan</h5>
            {submitted && (
              <div className="alert alert-success alert-dismissible fade show py-2" role="alert">
                <span>Terima kasih <strong>{senderName}</strong>, pesan Anda berhasil terkirim!</span>
                <button type="button" className="btn-close" onClick={() => setSubmitted(false)}></button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nama Lengkap</label>
                <input type="text" name="name" className="form-control" placeholder="Nama Anda" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" placeholder="email@contoh.com" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Pesan</label>
                <textarea name="message" className="form-control" rows="4" placeholder="Tulis pesan Anda di sini..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <h4 className="fw-bold">Pertanyaan Umum (FAQ)</h4>
            <p className="text-muted small">Informasi seputar praktikum dan website ini</p>
          </div>

          <div className="accordion shadow-sm" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div className="accordion-item" key={faq.id}>
                <h2 className="accordion-header" id={`heading${faq.id}`}>
                  <button
                    className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${faq.id}`}
                    aria-expanded={index === 0 ? 'true' : 'false'}
                    aria-controls={`collapse${faq.id}`}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div
                  id={`collapse${faq.id}`}
                  className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                  aria-labelledby={`heading${faq.id}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-muted">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
