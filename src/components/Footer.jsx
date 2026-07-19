const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0' }}>
      <div className="footer">
        <span className="footer-brand">🌾 Racine</span>
        <p className="footer-copy">
          © 2025 Racine — Assistant Rizicole Intelligent pour Madagascar
        </p>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="#features" style={{ color: 'var(--clr-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.25s' }}
            onMouseEnter={e => e.target.style.color = 'var(--clr-cyan)'}
            onMouseLeave={e => e.target.style.color = 'var(--clr-muted)'}
          >
            Fonctionnalités
          </a>
          <a href="/chat" style={{ color: 'var(--clr-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.25s' }}
            onMouseEnter={e => e.target.style.color = 'var(--clr-cyan)'}
            onMouseLeave={e => e.target.style.color = 'var(--clr-muted)'}
          >
            Commencer
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
