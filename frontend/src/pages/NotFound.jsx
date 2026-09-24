import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <motion.h1 initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-6xl font-bold text-primary-600 mb-4">404</motion.h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition">Go Home</Link>
    </div>
  )
}
