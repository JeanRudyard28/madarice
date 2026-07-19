import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ conversations = [], activeId, onSelect, onNew, onDelete, isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initial = user?.name?.charAt(0).toUpperCase() || '?'

  return (
    <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">🌾 Racine</Link>
        {/* Close button on mobile */}
        {isOpen && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--clr-muted)',
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: '0.25rem',
              display: 'none',
            }}
            className="sidebar-close-btn"
          >
            ✕
          </button>
        )}
      </div>

      {/* New conversation button */}
      <div style={{ padding: '0.75rem 0.75rem 0.5rem' }}>
        <button
          className="sidebar-new-btn"
          onClick={() => {
            onNew?.()
            onClose?.()
          }}
        >
          <span style={{ fontSize: '1rem' }}>＋</span>
          Nouvelle conversation
        </button>
      </div>

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.25rem 0' }}>
        <p className="sidebar-section-label">Historique</p>

        {conversations.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: 'var(--clr-muted)', padding: '0.5rem 1rem', opacity: 0.7 }}>
            Aucune conversation.
          </p>
        )}

        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conv-item${conv.id === activeId ? ' active' : ''}`}
            onClick={() => {
              onSelect?.(conv.id)
              onClose?.()
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="conv-title">{conv.title}</div>
              <div className="conv-date">{conv.date}</div>
            </div>
            {onDelete && (
              <button
                className="conv-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(conv.id)
                }}
                title="Supprimer"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer user */}
      <div className="sidebar-footer">
        {user ? (
          <>
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">{initial}</div>
              <Link to="/profile" className="sidebar-user-name">{user.name}</Link>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <span>↩</span> Se déconnecter
            </button>
          </>
        ) : (
          <Link to="/login" className="sidebar-login-link">
            <span>→</span> Se connecter
          </Link>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
