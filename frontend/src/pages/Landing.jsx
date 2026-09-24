import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { FiArrowRight } from 'react-icons/fi'

export default function Landing() {
  const { user, loading } = useAuth()
  if (!loading && user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <span className="inline-block bg-white/10 text-white text-sm px-4 py-1 rounded-full mb-6">
          AI-Powered Mock Interview Platform
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Practice Interviews. <br /> Get Hired Faster.
        </h1>
        <p className="text-primary-100 text-lg mb-8">
          Take aptitude, technical, HR & coding tests, simulate real interviews with camera &
          mic, and track your growth with detailed analytics.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary-50 transition"
          >
            Get Started <FiArrowRight />
          </Link>
          <Link
            to="/login"
            className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
