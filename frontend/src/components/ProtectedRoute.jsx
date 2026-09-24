import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { motion } from 'framer-motion'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader label="Checking session..." />
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 md:p-8 bg-gray-50 min-h-[calc(100vh-60px)]"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
