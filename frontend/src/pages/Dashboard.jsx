import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/Card'
import AnimatedCounter from '../components/AnimatedCounter'
import { useAuth } from '../context/AuthContext'
import * as resultsService from '../services/resultsService'
import {
  FiClipboard, FiVideo, FiUser, FiBarChart2, FiClock, FiPieChart, FiFileText,
} from 'react-icons/fi'

const cards = [
  { to: '/take-test', icon: FiClipboard, title: 'Take Test', description: 'Aptitude, Technical, HR & Coding tests.' },
  { to: '/interviews', icon: FiVideo, title: 'Interviews', description: 'Simulate real interviews with AI feedback.' },
  { to: '/results', icon: FiBarChart2, title: 'Interview Results', description: 'View your scores and feedback.' },
  { to: '/history', icon: FiClock, title: 'History', description: 'Browse all past tests and interviews.' },
  { to: '/analytics', icon: FiPieChart, title: 'Analytics', description: 'Visualize your performance trends.' },
  { to: '/resume', icon: FiFileText, title: 'Resume', description: 'Upload & analyze your resume.' },
  { to: '/profile', icon: FiUser, title: 'Profile', description: 'Manage your account & skills.' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    resultsService.getResultSummary().then((res) => setSummary(res.data)).catch(() => {})
  }, [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {user?.first_name || user?.username} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's a snapshot of your interview preparation journey.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tests Taken', value: summary?.total_tests_taken || 0 },
          { label: 'Interviews Completed', value: summary?.total_interviews_completed || 0 },
          { label: 'Avg Test Score', value: summary?.average_test_score || 0, suffix: '%' },
          { label: 'Avg Interview Score', value: summary?.average_interview_score || 0, suffix: '%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p className="text-3xl font-bold text-primary-600">
              <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <motion.div key={card.to} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
