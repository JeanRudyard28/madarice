import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    try {
      await register({ name, email, password })
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
            <Link to="/" className="auth-logo">Riziculture Solutions</Link>
          </div>
          <h1 className="auth-title">Créer un compte</h1>
          <p className="auth-subtitle">Sauvegardez votre historique de conversations</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">

          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Rakoto Jean"
              className="form-input"
            />
          </div>

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
              placeholder="Minimum 6 caractères"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button type="submit" className="form-submit" style={{ marginTop: '0.25rem' }}>
            Créer mon compte →
          </button>

          <p className="form-footer-link">
            Déjà un compte ?{' '}
            <Link to="/login">Se connecter</Link>
          </p>

        </form>

        <p className="auth-guest-link">
          <Link to="/chat">Continuer sans compte →</Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage
