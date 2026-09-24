import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiCamera } from 'react-icons/fi'
import * as profileService from '../services/profileService'
import * as resultsService from '../services/resultsService'
import Loader from '../components/Loader'
import AnimatedCounter from '../components/AnimatedCounter'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    first_name: '', last_name: '', bio: '', skills: '', education: '', designation: '', location: '',
  })

  useEffect(() => {
    profileService.getMyProfile().then((res) => {
      setProfile(res.data)
      setForm({
        first_name: res.data.user.first_name || '',
        last_name: res.data.user.last_name || '',
        bio: res.data.bio || '',
        skills: res.data.skills || '',
        education: res.data.education || '',
        designation: res.data.designation || '',
        location: res.data.location || '',
      })
      setLoading(false)
    })
    resultsService.getResultSummary().then((res) => setSummary(res.data))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await profileService.updateProfile(form)
      setProfile(res.data)
      setMessage('Profile updated successfully!')
    } finally {
      setSaving(false)
    }
  }

  const handlePictureChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const res = await profileService.uploadProfilePicture(file)
    setProfile(res.data)
  }

  if (loading) return <Loader label="Loading profile..." />

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <img
              src={profile.profile_picture || 'https://api.dicebear.com/7.x/initials/svg?seed=' + profile.user.username}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-primary-100"
            />
            <button onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700">
              <FiCamera />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
          </div>
          <h3 className="font-semibold text-gray-800">{profile.user.username}</h3>
          <p className="text-sm text-gray-500">{profile.user.email}</p>

          <div className="grid grid-cols-2 gap-3 mt-6 text-left">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-primary-600"><AnimatedCounter value={summary?.total_tests_taken || 0} /></p>
              <p className="text-xs text-gray-500">Tests</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-primary-600"><AnimatedCounter value={summary?.total_interviews_completed || 0} /></p>
              <p className="text-xs text-gray-500">Interviews</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-semibold text-gray-700 mb-4">Edit Details</h3>
          {message && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">{message}</div>}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input name="first_name" value={form.first_name} onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input name="last_name" value={form.last_name} onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Designation</label>
                <input name="designation" value={form.designation} onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
              <input name="skills" value={form.skills} onChange={handleChange} placeholder="Python, React, SQL"
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Education</label>
              <textarea name="education" value={form.education} onChange={handleChange} rows={3}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={saving}
              className="bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
