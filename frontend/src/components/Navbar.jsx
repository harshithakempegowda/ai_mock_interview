import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiLogOut, FiUser } from 'react-icons/fi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 glass border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-primary-700 flex items-center gap-2">
        <span className="bg-primary-600 text-white rounded-lg px-2 py-1 text-sm">AI</span>
        Mock Interview Platform
      </Link>
      {user && (
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition">
            <FiUser />
            <span className="hidden sm:inline">{user.username}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}
