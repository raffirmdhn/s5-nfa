function Team() {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Halaman Team</h2>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <img src="https://via.placeholder.com/150" className="card-img-top" alt="Member" />
            <div className="card-body text-center">
              <h5 className="card-title">Nama Anggota 1</h5>
              <p className="card-text">Posisi / Role</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <img src="https://via.placeholder.com/150" className="card-img-top" alt="Member" />
            <div className="card-body text-center">
              <h5 className="card-title">Nama Anggota 2</h5>
              <p className="card-text">Posisi / Role</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Team
