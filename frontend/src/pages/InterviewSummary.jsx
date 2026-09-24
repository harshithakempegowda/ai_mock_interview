import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as interviewService from '../services/interviewService'
import Loader from '../components/Loader'
import AnimatedCounter from '../components/AnimatedCounter'

export default function InterviewSummary() {
  const { interviewId } = useParams()
  const [interview, setInterview] = useState(null)

  useEffect(() => {
    interviewService.getInterview(interviewId).then((res) => setInterview(res.data))
  }, [interviewId])

  if (!interview) return <Loader label="Loading interview summary..." />

  const scoreCards = [
    { label: 'Overall Score', value: interview.overall_score },
    { label: 'Communication', value: interview.communication_score },
    { label: 'Technical', value: interview.technical_score },
    { label: 'Confidence', value: interview.confidence_score },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-gray-800 mb-2 capitalize">
        {interview.interview_type} Interview Summary
      </motion.h1>
      <p className="text-gray-500 mb-8">Completed on {new Date(interview.completed_at).toLocaleString()}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {scoreCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-primary-600"><AnimatedCounter value={s.value} suffix="%" /></p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
          <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
          <p className="text-sm text-green-800">{interview.strengths}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
          <h3 className="font-semibold text-red-700 mb-2">Weaknesses</h3>
          <p className="text-sm text-red-800">{interview.weaknesses}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <h3 className="font-semibold text-blue-700 mb-2">Suggestions</h3>
          <p className="text-sm text-blue-800">{interview.suggestions}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="font-semibold text-gray-700 mb-4">Your Responses</h3>
        <div className="space-y-4">
          {interview.responses.map((r, i) => (
            <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
              <p className="text-sm font-medium text-gray-700">Q{i + 1}: {r.question_text}</p>
              <p className="text-sm text-gray-500 mt-1">{r.answer_text || <span className="italic text-gray-400">No answer provided</span>}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/interviews" className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Back to Interviews</Link>
        <Link to="/analytics" className="px-5 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700">View Analytics</Link>
      </div>
    </div>
  )
}
