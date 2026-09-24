import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as historyService from '../services/historyService'
import Loader from '../components/Loader'

export default function History() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchHistory = (params = {}) => {
    setLoading(true)
    historyService.getHistory(params).then((res) => {
      setItems(res.data)
      setLoading(false)
    })
  }

  useEffect(() => { fetchHistory() }, [])

  const handleFilter = () => {
    const params = {}
    if (typeFilter !== 'all') params.type = typeFilter
    if (search) params.search = search
    fetchHistory(params)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">History</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm">
          <option value="all">All Types</option>
          <option value="test">Tests Only</option>
          <option value="interview">Interviews Only</option>
        </select>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by category..."
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm flex-1 min-w-[200px]"
        />
        <button onClick={handleFilter} className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm hover:bg-primary-700">
          Apply
        </button>
      </div>

      {loading ? <Loader label="Loading history..." /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr><th className="p-4">Type</th><th className="p-4">Category</th><th className="p-4">Score</th><th className="p-4">Status</th><th className="p-4">Date</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td className="p-4 text-gray-400" colSpan={5}>No records found.</td></tr>}
              {items.map((item, idx) => (
                <motion.tr key={`${item.type}-${item.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }}
                  className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 capitalize">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.type === 'test' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4 font-medium">{item.score}%</td>
                  <td className="p-4 capitalize">{item.status.replace('_', ' ')}</td>
                  <td className="p-4">{new Date(item.date).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
