import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiCpu, FiUsers, FiSmile, FiCode } from 'react-icons/fi'
import * as interviewService from '../services/interviewService'
import Loader from '../components/Loader'

const types = [
  {
    key: 'technical',
    label: 'Technical',
    icon: FiCpu,
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    key: 'hr',
    label: 'HR',
    icon: FiUsers,
    color: 'from-rose-500 to-rose-600',
  },
  {
    key: 'behavioral',
    label: 'Behavioral',
    icon: FiSmile,
    color: 'from-amber-500 to-amber-600',
  },
  {
    key: 'coding',
    label: 'Coding',
    icon: FiCode,
    color: 'from-emerald-500 to-emerald-600',
  },
]

export default function Interviews() {
  const navigate = useNavigate()

  const [starting, setStarting] = useState(false)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await interviewService.getMyInterviews()
        setHistory(res.data || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load interview history.')
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [])

  const handleStart = async (type) => {
    if (starting) return

    setStarting(true)

    try {
      const res = await interviewService.startInterview(type)

      if (res?.data?.id) {
        navigate(`/interviews/session/${res.data.id}`)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to start interview.')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Mock Interviews
      </h1>

      <p className="text-gray-500 mb-8">
        Select an interview type. Camera and microphone access will be requested.
      </p>

      {/* Interview Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {types.map((t, i) => (
          <motion.div
            key={t.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleStart(t.key)}
            className={`cursor-pointer rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${
              starting ? 'pointer-events-none opacity-70' : ''
            }`}
          >
            <div
              className={`bg-gradient-to-br ${t.color} text-white p-6 h-full`}
            >
              <t.icon className="text-3xl mb-3" />

              <h3 className="text-lg font-semibold">
                {t.label} Interview
              </h3>

              <p className="text-sm text-white/80 mt-1">
                Start a {t.label.toLowerCase()} mock interview session.
              </p>

              {starting && (
                <p className="mt-3 text-sm text-white/90">
                  Starting...
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Interviews */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Recent Interviews
      </h2>

      {loading ? (
        <Loader label="Loading interviews..." />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">
          No interviews yet. Start one above!
        </p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Score</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {history.map((h) => (
                <tr
                  key={h.id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 capitalize">
                    {h.interview_type}
                  </td>

                  <td className="p-4 capitalize">
                    {h.status.replace('_', ' ')}
                  </td>

                  <td className="p-4">
                    {h.status === 'completed'
                      ? `${h.overall_score}%`
                      : '-'}
                  </td>

                  <td className="p-4">
                    {new Date(h.started_at).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {h.status === 'completed' ? (
                      <button
                        onClick={() =>
                          navigate(`/interviews/summary/${h.id}`)
                        }
                        className="text-primary-600 hover:underline"
                      >
                        View Summary
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(`/interviews/session/${h.id}`)
                        }
                        className="text-primary-600 hover:underline"
                      >
                        Resume Interview
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}