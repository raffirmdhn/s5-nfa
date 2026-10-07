function Home({ setActivePage }) {
  const techStack = [
    { name: 'HTML5', icon: 'bi-filetype-html', desc: 'Struktur Web' },
    { name: 'CSS3', icon: 'bi-filetype-css', desc: 'Styling Dasar' },
    { name: 'JavaScript', icon: 'bi-filetype-js', desc: 'Logika & Interaktivitas' },
    { name: 'React JS', icon: 'bi-code-square', desc: 'Komponen UI' },
    { name: 'Bootstrap 5', icon: 'bi-bootstrap', desc: 'Grid & Utility' },
    { name: 'Git & GitHub', icon: 'bi-git', desc: 'Version Control' }
  ]

  return (
    <div className="container my-5 py-3">
      {/* Hero Section */}
      <div className="row align-items-center g-4 mb-5 pb-4 border-bottom">
        <div className="col-md-6">
          <h1 className="fw-bold mb-3">Selamat Datang di Website Saya</h1>
          <p className="text-muted mb-4">
            Halo! Saya <strong>Raffi Ramadhan</strong>, mahasiswa Teknik Informatika STT Terpadu Nurul Fikri (NIM: 0110224204). 
            Website ini dibuat untuk memenuhi tugas praktikum React JS Pertemuan 1 dengan memanfaatkan konsep modular component dan Bootstrap styling.
          </p>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={() => setActivePage('team')}>
              Lihat Team
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setActivePage('contact')}>
              Hubungi Saya
            </button>
          </div>
        </div>
        <div className="col-md-6 text-center">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80"
            alt="Web Development"
            className="img-fluid rounded shadow-sm"
          />
        </div>
      </div>

      {/* Tech Stack Section */}
      <div>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Teknologi yang Dipelajari</h3>
          <p className="text-muted">Tools dan teknologi dalam praktikum Pemrograman Web Semester 5</p>
        </div>

        <div className="row g-3">
          {techStack.map((tech, index) => (
            <div className="col-6 col-md-4 col-lg-2" key={index}>
              <div className="card h-100 text-center p-3 border shadow-sm">
                <div className="fs-1 text-primary mb-2">
                  <i className={`bi ${tech.icon}`}></i>
                </div>
                <h6 className="fw-semibold mb-1">{tech.name}</h6>
                <small className="text-muted">{tech.desc}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
