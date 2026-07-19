import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ conversations = [], activeId, onSelect, onNew, onDelete }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 h-screen bg-gray-900 border-r border-white/10 flex flex-col">

      <div className="p-4 border-b border-white/10">
        <Link to="/" className="text-cyan-400 font-bold text-lg">Racine</Link>
      </div>

      <div className="p-4">
        <button
          onClick={onNew}
          className="w-full bg-cyan-400 text-gray-950 rounded-full py-2 text-sm font-medium hover:bg-cyan-300 transition"
        >
          + Nouvelle conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <p className="text-gray-500 text-xs uppercase tracking-widest px-2 mb-2">Historique</p>
        {conversations.length === 0 && (
          <p className="text-gray-600 text-xs px-3">Aucune conversation pour le moment.</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect?.(conv.id)}
            className={`group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition ${
              conv.id === activeId ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex flex-col min-w-0">
              <span className="text-white text-sm truncate">{conv.title}</span>
              <span className="text-gray-500 text-xs mt-1">{conv.date}</span>
            </div>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(conv.id)
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs transition shrink-0 ml-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 flex flex-col gap-2">
        {user ? (
          <>
            <Link
              to="/profile"
              className="text-sm text-gray-300 hover:text-cyan-400 transition truncate"
            >
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-sm text-gray-400 hover:text-cyan-400 transition text-left"
            >
              Se déconnecter
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="w-full text-sm text-gray-400 hover:text-cyan-400 transition text-left"
          >
            Se connecter
          </Link>
        )}
      </div>

    </aside>
  )
}

export default Sidebar
