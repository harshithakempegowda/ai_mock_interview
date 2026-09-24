import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiHome, FiClipboard, FiVideo, FiBarChart2, FiClock, FiPieChart, FiFileText, FiUser,
} from 'react-icons/fi'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/take-test', label: 'Take Test', icon: FiClipboard },
  { to: '/interviews', label: 'Interviews', icon: FiVideo },
  { to: '/results', label: 'Results', icon: FiBarChart2 },
  { to: '/history', label: 'History', icon: FiClock },
  { to: '/analytics', label: 'Analytics', icon: FiPieChart },
  { to: '/resume', label: 'Resume', icon: FiFileText },
  { to: '/profile', label: 'Profile', icon: FiUser },
]

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-60 hidden md:flex flex-col gap-1 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] py-6 px-3"
    >
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
            }`
          }
        >
          <Icon className="text-lg" />
          <span className="font-medium">{label}</span>
        </NavLink>
      ))}
    </motion.aside>
  )
}
