import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUploadCloud, FiFileText } from 'react-icons/fi'
import * as resumeService from '../services/resumeService'
import Loader from '../components/Loader'

export default function Resume() {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const loadResume = () => {
    setLoading(true)
    resumeService.getLatestResume()
      .then((res) => setResume(res.data))
      .catch(() => setResume(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadResume() }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const res = await resumeService.uploadResume(file)
      setResume(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Resume Analyzer</h1>
      <p className="text-gray-500 mb-8">Upload your resume in PDF format to get an automated analysis.</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-primary-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-primary-50 transition mb-6"
      >
        <FiUploadCloud className="text-4xl text-primary-500 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">{uploading ? 'Uploading & analyzing...' : 'Click to upload your resume (PDF)'}</p>
        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
      </motion.div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      {loading ? <Loader label="Loading resume..." /> : resume ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <FiFileText className="text-2xl text-primary-600" />
            <div>
              <p className="font-semibold text-gray-800">Resume Score: <span className="text-primary-600">{resume.resume_score}/100</span></p>
              <p className="text-xs text-gray-400">Uploaded on {new Date(resume.uploaded_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Name</p>
              <p className="font-medium text-gray-800">{resume.extracted_name || 'Not detected'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Email</p>
              <p className="font-medium text-gray-800">{resume.extracted_email || 'Not detected'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Phone</p>
              <p className="font-medium text-gray-800">{resume.extracted_phone || 'Not detected'}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Skills</p>
              <p className="font-medium text-gray-800">{resume.extracted_skills || 'Not detected'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400 mb-1">Education</p>
              <p className="font-medium text-gray-800 whitespace-pre-line">{resume.extracted_education || 'Not detected'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400 mb-1">Projects</p>
              <p className="font-medium text-gray-800 whitespace-pre-line">{resume.extracted_projects || 'Not detected'}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-5 text-sm text-blue-800">
            <p className="font-semibold mb-1">Suggestions</p>
            <p>{resume.suggestions}</p>
          </div>
        </motion.div>
      ) : (
        <p className="text-gray-500 text-center">No resume uploaded yet.</p>
      )}
    </div>
  )
}
