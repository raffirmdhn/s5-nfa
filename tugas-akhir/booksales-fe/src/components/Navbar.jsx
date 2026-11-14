import { Link, NavLink } from 'react-router-dom'

function Navbar({ totalBooks = 0 }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-semibold" to="/">
          <i className="bi bi-book-half text-primary"></i>
          <span>BookSales</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Navigasi Menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-lg-1 align-items-lg-center">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded ${isActive ? 'active-link text-white fw-medium' : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/book"
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded d-flex align-items-center gap-2 ${
                    isActive ? 'active-link text-white fw-medium' : ''
                  }`
                }
              >
                <span>Daftar Buku</span>
                {totalBooks > 0 && (
                  <span className="badge text-bg-primary rounded-pill">{totalBooks}</span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
