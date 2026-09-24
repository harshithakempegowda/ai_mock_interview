import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as authService from '../services/authService'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setError(''); setSubmitting(true)
    try {
      const res = await authService.requestPasswordReset(email)
      setDemoOtp(res.data.demo_otp || '')
      setMessage('An OTP has been generated. Enter it below to reset your password.')
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not find an account with that email.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError(''); setSubmitting(true)
    try {
      await authService.resetPassword({ email, otp, new_password: newPassword })
      setMessage('Password reset successful! You can now log in with your new password.')
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Reset your password</h2>
        <p className="text-gray-500 mb-6">We'll help you get back into your account.</p>

        {message && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">{message}</div>}
        {demoOtp && <div className="bg-yellow-50 text-yellow-700 text-sm p-3 rounded-lg mb-4">Demo OTP (would normally be emailed): <strong>{demoOtp}</strong></div>}
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} disabled={submitting}
              className="w-full bg-primary-600 text-white font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition disabled:opacity-60">
              {submitting ? 'Sending...' : 'Send OTP'}
            </motion.button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">OTP Code</label>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} required
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
                className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} disabled={submitting}
              className="w-full bg-primary-600 text-white font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition disabled:opacity-60">
              {submitting ? 'Resetting...' : 'Reset Password'}
            </motion.button>
          </form>
        )}

        {step === 3 && (
          <Link to="/login" className="block text-center bg-primary-600 text-white font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition">
            Go to Login
          </Link>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-primary-600 hover:underline">Back to login</Link>
        </p>
      </motion.div>
    </div>
  )
}
