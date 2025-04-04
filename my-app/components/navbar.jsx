import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">PrivacyGuard AI</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/userdata' ? 'active' : ''}`} to="/userdata">User Data</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/analyze' ? 'active' : ''}`} to="/analyze">Analyze</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
