import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Card({ to, icon: Icon, title, description, color = 'primary' }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Link
        to={to}
        className="block h-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${color}-100 text-${color}-600`}>
          <Icon className="text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </Link>
    </motion.div>
  )
}
