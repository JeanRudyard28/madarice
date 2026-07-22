import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login({ email, password })
      navigate('/chat')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">

        {/* Header */}
        <div className="auth-header">
          <div>
            <Link to="/" className="auth-logo">Racine</Link>
          </div>
          <h1 className="auth-title">Bon retour 👋</h1>
          <p className="auth-subtitle">Connectez-vous pour accéder à votre historique</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button type="submit" className="form-submit" style={{ marginTop: '0.25rem' }}>
            Se connecter →
          </button>

          <p className="form-footer-link">
            Pas encore de compte ?{' '}
            <Link to="/register">S'inscrire</Link>
          </p>

        </form>

        <p className="auth-guest-link">
          <Link to="/chat">Continuer sans compte →</Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage
