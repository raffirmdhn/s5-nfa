function Home() {
  return (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Selamat Datang di Website Saya</h1>
          <p>
            Ini adalah contoh pembuatan landing page sederhana menggunakan React JS dan Bootstrap pada Pertemuan 1.
          </p>
          <button className="btn btn-primary">Pelajari Lebih Lanjut</button>
        </div>
        <div className="col-md-6 text-center">
          <img
            src="https://via.placeholder.com/400x300"
            alt="Placeholder"
            className="img-fluid rounded"
          />
        </div>
      </div>
    </div>
  )
}

export default Home
