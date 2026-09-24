import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import * as resultsService from '../services/resultsService'
import Loader from '../components/Loader'

export default function Results() {
  const [data, setData] = useState(null)

  useEffect(() => {
    resultsService.getAllResults().then((res) => setData(res.data))
  }, [])

  if (!data) return <Loader label="Loading results..." />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Results</h1>

      <h2 className="text-lg font-semibold text-gray-700 mb-3">Test Results</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr><th className="p-4">Category</th><th className="p-4">Score</th><th className="p-4">Correct / Total</th><th className="p-4">Date</th></tr>
          </thead>
          <tbody>
            {data.test_results.length === 0 && (
              <tr><td className="p-4 text-gray-400" colSpan={4}>No test results yet. <Link to="/take-test" className="text-primary-600">Take a test</Link></td></tr>
            )}
            {data.test_results.map((t) => (
              <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-4 capitalize">{t.category_name}</td>
                <td className="p-4 font-semibold text-primary-600">{t.score}%</td>
                <td className="p-4">{t.correct_answers} / {t.total_questions}</td>
                <td className="p-4">{new Date(t.started_at).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-3">Interview Results</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr><th className="p-4">Type</th><th className="p-4">Overall</th><th className="p-4">Communication</th><th className="p-4">Technical</th><th className="p-4">Date</th></tr>
          </thead>
          <tbody>
            {data.interview_results.length === 0 && (
              <tr><td className="p-4 text-gray-400" colSpan={5}>No interview results yet. <Link to="/interviews" className="text-primary-600">Start an interview</Link></td></tr>
            )}
            {data.interview_results.map((i) => (
              <motion.tr key={i.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-4 capitalize">{i.interview_type}</td>
                <td className="p-4 font-semibold text-primary-600">{i.overall_score}%</td>
                <td className="p-4">{i.communication_score}%</td>
                <td className="p-4">{i.technical_score}%</td>
                <td className="p-4">{new Date(i.started_at).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
