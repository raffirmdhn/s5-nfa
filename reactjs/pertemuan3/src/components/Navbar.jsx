import { Link, NavLink } from 'react-router-dom'

function Navbar({ totalBooks = 0 }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm custom-navbar">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span>BookSales</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded ${isActive ? 'active-link fw-semibold text-white' : 'text-secondary'}`
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
                    isActive ? 'active-link fw-semibold text-white' : 'text-secondary'
                  }`
                }
              >
                <span>Book</span>
                {totalBooks > 0 && (
                  <span className="badge bg-danger rounded-pill">{totalBooks}</span>
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
