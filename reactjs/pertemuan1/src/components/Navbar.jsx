function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a
          className="navbar-brand"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setActivePage('home')
          }}
        >
          Praktikum React
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'home' ? 'active' : ''}`}
                onClick={() => setActivePage('home')}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'team' ? 'active' : ''}`}
                onClick={() => setActivePage('team')}
              >
                Team
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link btn btn-link text-decoration-none ${activePage === 'contact' ? 'active' : ''}`}
                onClick={() => setActivePage('contact')}
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
