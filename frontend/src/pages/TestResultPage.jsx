import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as testService from '../services/testService'
import Loader from '../components/Loader'
import AnimatedCounter from '../components/AnimatedCounter'

export default function TestResultPage() {
  const { attemptId } = useParams()
  const [attempt, setAttempt] = useState(null)

  useEffect(() => {
    testService.getAttemptDetail(attemptId).then((res) => setAttempt(res.data))
  }, [attemptId])

  if (!attempt) return <Loader label="Loading results..." />

  return (
    <div className="max-w-xl mx-auto text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-xl font-semibold text-gray-700 mb-2 capitalize">{attempt.category_name} Test Result</h1>
        <p className="text-5xl font-bold text-primary-600 my-4">
          <AnimatedCounter value={attempt.score} suffix="%" />
        </p>
        <p className="text-gray-500 mb-6">
          You answered {attempt.correct_answers} out of {attempt.total_questions} questions correctly.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/take-test" className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
            Take Another Test
          </Link>
          <Link to="/results" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700">
            View All Results
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
