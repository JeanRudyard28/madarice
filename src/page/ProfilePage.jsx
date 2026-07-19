import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getConversations } from '../lib/storage'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const conversations = getConversations()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="text-cyan-400 font-bold text-2xl">Racine</Link>
          <p className="text-white text-xl font-bold mt-6">Vous n'êtes pas connecté</p>
          <p className="text-gray-400 text-sm mt-2 mb-8">
            Créez un compte pour accéder à votre profil et sauvegarder votre historique.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/login" className="text-sm text-gray-300 border border-white/10 px-5 py-2.5 rounded-full hover:border-cyan-400/40 transition">
              Se connecter
            </Link>
            <Link to="/register" className="text-sm bg-cyan-400 text-gray-950 px-5 py-2.5 rounded-full font-medium hover:bg-cyan-300 transition">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const initial = user.name?.charAt(0).toUpperCase() || '?'

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="text-cyan-400 font-bold text-2xl">Racine</Link>
          <h1 className="text-white text-2xl font-bold mt-6">Mon profil</h1>
        </div>

        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 flex flex-col gap-6">

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-cyan-400 text-gray-950 flex items-center justify-center text-xl font-bold">
              {initial}
            </div>
            <div>
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <span className="text-gray-400 text-sm">Conversations sauvegardées</span>
            <span className="text-cyan-400 font-semibold text-sm">{conversations.length}</span>
          </div>

          <Link
            to="/chat"
            className="w-full text-center bg-cyan-400 text-gray-950 py-3 rounded-xl text-sm font-medium hover:bg-cyan-300 transition"
          >
            Retour au chat
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-400 hover:text-red-400 transition"
          >
            Se déconnecter
          </button>

        </div>

      </div>
    </div>
  )
}

export default ProfilePage
