import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import TakeTest from './pages/TakeTest'
import TestCategoryPage from './pages/TestCategoryPage'
import TestResultPage from './pages/TestResultPage'
import Interviews from './pages/Interviews'
import InterviewSession from './pages/InterviewSession'
import InterviewSummary from './pages/InterviewSummary'
import Results from './pages/Results'
import History from './pages/History'
import Analytics from './pages/Analytics'
import Resume from './pages/Resume'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Landing from './pages/Landing'

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/take-test" element={<ProtectedRoute><TakeTest /></ProtectedRoute>} />
        <Route path="/take-test/:category" element={<ProtectedRoute><TestCategoryPage /></ProtectedRoute>} />
        <Route path="/test-result/:attemptId" element={<ProtectedRoute><TestResultPage /></ProtectedRoute>} />
        <Route path="/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
        <Route path="/interviews/session/:interviewId" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
        <Route path="/interviews/summary/:interviewId" element={<ProtectedRoute><InterviewSummary /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
