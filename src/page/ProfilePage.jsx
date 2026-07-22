import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getConversations } from '../lib/storage'
import { getBackendConversations, getBackendMessages } from '../lib/api'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [convCount, setConvCount] = useState(0)
  const [msgCount, setMsgCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return
      setLoading(true)
      
      if (user.token) {
        // Mode connecté : charger depuis le serveur
        try {
          const backendConvs = await getBackendConversations(user.token)
          setConvCount(backendConvs.length)
          
          // Récupérer tous les messages en parallèle pour de meilleures performances
          const messagesPromises = backendConvs.map(conv =>
            getBackendMessages(conv.id, user.token).catch(() => [])
          )
          const allMessages = await Promise.all(messagesPromises)
          const totalMessages = allMessages.reduce((sum, msgs) => sum + msgs.length, 0)
          setMsgCount(totalMessages)
        } catch (err) {
          console.error("Erreur lors de la récupération des stats du profil:", err)
        } finally {
          setLoading(false)
        }
      } else {
        // Mode invité : charger depuis le localStorage
        const localConvs = getConversations()
        setConvCount(localConvs.length)
        const totalMessages = localConvs.reduce((acc, c) => acc + (c.messages?.length || 0), 0)
        setMsgCount(totalMessages)
        setLoading(false)
      }
    }
    loadStats()
  }, [user])

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card animate-fade-in-up" style={{ textAlign: 'center' }}>
          <Link to="/" className="auth-logo" style={{ justifyContent: 'center', display: 'flex', marginBottom: '1.5rem' }}>Riziculture Solutions</Link>
          <h1 className="auth-title">Vous n'êtes pas connecté</h1>
          <p className="auth-subtitle" style={{ marginBottom: '2rem', marginTop: '0.5rem' }}>
            Créez un compte pour accéder à votre profil et sauvegarder votre historique.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-secondary">Se connecter</Link>
            <Link to="/register" className="btn-primary">S'inscrire</Link>
          </div>
        </div>
      </div>
    )
  }

  const initial = user.name?.charAt(0).toUpperCase() || '?'

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">

        {/* Header */}
        <div className="auth-header">
          <div>
            <Link to="/" className="auth-logo">Riziculture Solutions</Link>
          </div>
          <h1 className="auth-title">Mon profil</h1>
        </div>

        {/* Profile card */}
        <div className="auth-form" style={{ gap: '1.5rem' }}>

          {/* User identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="profile-avatar">{initial}</div>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--clr-text)', fontSize: '1rem' }}>{user.name}</p>
              <p style={{ color: 'var(--clr-muted)', fontSize: '0.85rem', marginTop: '0.15rem' }}>{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="stat-badge">
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-muted)' }}>Conversations</span>
              <span style={{ fontWeight: 700, color: 'var(--clr-cyan)', fontSize: '1.1rem' }}>
                {loading ? "..." : convCount}
              </span>
            </div>
            <div className="stat-badge">
              <span style={{ fontSize: '0.8rem', color: 'var(--clr-muted)' }}>Messages</span>
              <span style={{ fontWeight: 700, color: 'var(--clr-cyan)', fontSize: '1.1rem' }}>
                {loading ? "..." : msgCount}
              </span>
            </div>
          </div>

          {/* Actions */}
          <Link
            to="/chat"
            className="form-submit"
            style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
          >
            Retour au chat →
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'none',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px',
              padding: '0.75rem',
              color: '#f87171',
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(239,68,68,0.08)'
              e.target.style.borderColor = 'rgba(239,68,68,0.4)'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'none'
              e.target.style.borderColor = 'rgba(239,68,68,0.2)'
            }}
          >
            Se déconnecter
          </button>

        </div>

      </div>
    </div>
  )
}

export default ProfilePage
