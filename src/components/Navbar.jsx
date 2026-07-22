import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Riziculture Solutions</Link>

        {/* Desktop links */}
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#features" className="nav-link">Fonctionnalités</a>
          {user ? (
            <Link to="/profile" className="nav-link">{user.name}</Link>
          ) : (
            <Link to="/login" className="nav-link">Se connecter</Link>
          )}
          <Link to="/chat" className="btn-primary">
            Commencer →
          </Link>
        </div>

        {/* Hamburger mobile */}
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)}>
        <a href="#features" onClick={() => setMenuOpen(false)}>Fonctionnalités</a>
        {user ? (
          <Link to="/profile" onClick={() => setMenuOpen(false)}>{user.name}</Link>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Se connecter</Link>
        )}
        <Link
          to="/chat"
          className="btn-primary"
          onClick={() => setMenuOpen(false)}
          style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
        >
          Commencer →
        </Link>
      </div>
    </>
  )
}

export default Navbar
