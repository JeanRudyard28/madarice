import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      login({ email, password })
      navigate('/chat')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="text-cyan-400 font-bold text-2xl">Racine</Link>
          <h1 className="text-white text-2xl font-bold mt-6">Bon retour</h1>
          <p className="text-gray-400 text-sm mt-2">Connectez-vous pour accéder à votre historique</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/10 rounded-2xl p-8 flex flex-col gap-4">

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              className="bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-400 transition placeholder-gray-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-gray-950 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-400 transition placeholder-gray-600"
            />
          </div>

          <button type="submit" className="w-full bg-cyan-400 text-gray-950 py-3 rounded-xl text-sm font-medium hover:bg-cyan-300 transition mt-2">
            Se connecter
          </button>

          <p className="text-center text-gray-500 text-sm">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline">
              S'inscrire
            </Link>
          </p>

        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          <Link to="/chat" className="hover:text-cyan-400 transition">
            Continuer sans compte →
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage
