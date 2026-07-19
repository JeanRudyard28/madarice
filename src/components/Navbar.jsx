import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user } = useAuth()

  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between border-b border-white/10">
      <span className="text-xl font-bold text-cyan-400">Racine</span>

      <div className="flex items-center gap-7">
        {user ? (
          <Link to="/profile" className="text-sm text-gray-400 hover:text-cyan-400 transition">
            {user.name}
          </Link>
        ) : (
          <Link to="/login" className="text-sm text-gray-400 hover:text-cyan-400 transition">Se connecter</Link>
        )}
        <Link to="/chat" className="text-sm bg-cyan-400 text-gray-950 px-4 py-2 rounded-full font-medium hover:bg-cyan-300 transition">Commencer</Link>
      </div>
    </nav>
  )
}

export default Navbar
