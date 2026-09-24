import { motion } from 'framer-motion'

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <p className="text-gray-500 text-sm animate-pulse">{label}</p>
    </div>
  )
}
