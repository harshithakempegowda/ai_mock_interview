import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiCpu, FiCode, FiUsers, FiHash } from 'react-icons/fi'

const categories = [
  { key: 'aptitude', label: 'Aptitude', icon: FiHash, color: 'from-blue-500 to-blue-600', desc: 'Logical reasoning & quantitative skills.' },
  { key: 'behavioral', label: 'behavioural', icon: FiCpu, color: 'from-purple-500 to-purple-600', desc: 'Core CS & domain knowledge.' },
  { key: 'hr', label: 'HR', icon: FiUsers, color: 'from-pink-500 to-pink-600', desc: 'Behavioral & situational questions.' },
  { key: 'coding', label: 'Coding', icon: FiCode, color: 'from-green-500 to-green-600', desc: 'Programming fundamentals.' },
]

export default function TakeTest() {
  const navigate = useNavigate()
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Take a Test</h1>
      <p className="text-gray-500 mb-8">Choose a category to begin your practice test.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            onClick={() => navigate(`/take-test/${cat.key}`)}
            className="cursor-pointer rounded-2xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div className={`bg-gradient-to-br ${cat.color} text-white p-6 h-full`}>
              <cat.icon className="text-3xl mb-3" />
              <h3 className="text-lg font-semibold">{cat.label}</h3>
              <p className="text-sm text-white/80 mt-1">{cat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
