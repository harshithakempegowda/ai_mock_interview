import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import * as testService from '../services/testService'
import Loader from '../components/Loader'

export default function TestCategoryPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    testService.getQuestions(category).then((res) => {
      setQuestions(res.data)
      setLoading(false)
    })
  }, [category])

  const selectOption = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option })
  }

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1)
  }
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const payload = {
      category,
      answers: questions.map((q) => ({
        question_id: q.id,
        selected_option: answers[q.id] || '',
      })),
    }
    try {
      const res = await testService.submitTest(payload)
      navigate(`/test-result/${res.data.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader label="Loading questions..." />
  if (!questions.length) return <p className="text-gray-500">No questions available for this category yet.</p>

  const q = questions[current]
  const options = [
    { key: 'a', text: q.option_a }, { key: 'b', text: q.option_b },
    { key: 'c', text: q.option_c }, { key: 'd', text: q.option_d },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800 capitalize">{category} Test</h1>
        <span className="text-sm text-gray-500">{current + 1} / {questions.length}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <motion.div
          className="bg-primary-600 h-2 rounded-full"
          animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-5">{q.text}</h2>
          <div className="space-y-3">
            {options.filter(o => o.text).map((opt) => (
              <button
                key={opt.key}
                onClick={() => selectOption(q.id, opt.key)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                  answers[q.id] === opt.key
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <span className="font-medium uppercase mr-2">{opt.key}.</span>{opt.text}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <button onClick={handlePrev} disabled={current === 0}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-40">
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button onClick={handleNext} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700">
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        )}
      </div>
    </div>
  )
}
