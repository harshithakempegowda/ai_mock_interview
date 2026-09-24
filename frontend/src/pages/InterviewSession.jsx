import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMic, FiVideo, FiAlertCircle, FiVolume2 } from 'react-icons/fi'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import * as interviewService from '../services/interviewService'
import { useMediaDevices } from '../hooks/useMediaDevices'
import Loader from '../components/Loader'

export default function InterviewSession() {
  const { interviewId } = useParams()
  const navigate = useNavigate()

  const {
    videoRef,
    permissionGranted,
    error,
    requestPermissions,
    stopStream,
  } = useMediaDevices()

  const [interview, setInterview] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [questionSeconds, setQuestionSeconds] = useState(60)
  const [submitting, setSubmitting] = useState(false)

  const sessionTimerRef = useRef(null)
  const questionTimerRef = useRef(null)

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  useEffect(() => {
    interviewService
      .getInterview(interviewId)
      .then((res) => {
        setInterview(res.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [interviewId])

  useEffect(() => {
    if (permissionGranted) {
      sessionTimerRef.current = setInterval(() => {
        setSessionSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(sessionTimerRef.current)
  }, [permissionGranted])

  useEffect(() => {
    if (!permissionGranted || !interview) return

    setQuestionSeconds(60)

    clearInterval(questionTimerRef.current)

    questionTimerRef.current = setInterval(() => {
      setQuestionSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(questionTimerRef.current)
          handleNext()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(questionTimerRef.current)
  }, [current, permissionGranted, interview])

  useEffect(() => {
    if (transcript) {
      setAnswerText(transcript)
    }
  }, [transcript])

  useEffect(() => {
    if (
      interview &&
      interview.responses &&
      interview.responses.length > 0
    ) {
      const question =
        interview.responses[current]?.question_text

      if (question) {
        speakQuestion(question)
      }
    }
  }, [interview, current])

  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening()
      speechSynthesis.cancel()
      stopStream()
      clearInterval(sessionTimerRef.current)
      clearInterval(questionTimerRef.current)
    }
  }, [])

  const speakQuestion = (text) => {
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.rate = 1
    utterance.pitch = 1

    speechSynthesis.speak(utterance)
  }

  const startRecording = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-IN',
    })
  }

  const stopRecording = () => {
    SpeechRecognition.stopListening()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${String(mins).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`
  }

  const handleNext = async () => {
    if (!interview || submitting) return

    setSubmitting(true)

    try {
      const responses = interview.responses
      const resp = responses[current]

      await interviewService.submitResponse(
        interview.id,
        {
          response_id: resp.id,
          answer_text: answerText,
          duration_seconds: 60 - questionSeconds,
        }
      )

      SpeechRecognition.stopListening()
      resetTranscript()
      setAnswerText('')

      if (current < responses.length - 1) {
        setCurrent((prev) => prev + 1)
      } else {
        const res =
          await interviewService.completeInterview(
            interview.id,
            {
              duration_seconds: sessionSeconds,
            }
          )

        stopStream()

        navigate(
          `/interviews/summary/${res.data.id}`
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Loader label="Preparing interview..." />
    )
  }

  if (!interview) {
    return <p>Interview not found.</p>
  }

  if (!permissionGranted) {
    return (
      <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-center gap-4 text-3xl text-primary-600 mb-4">
          <FiVideo />
          <FiMic />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Camera & Microphone Access
        </h2>

        <p className="text-gray-500 mb-6">
          This interview requires access to your camera and microphone.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4 text-sm">
            <FiAlertCircle />
            {error}
          </div>
        )}

        <button
          onClick={requestPermissions}
          className="bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition"
        >
          Grant Access & Start
        </button>
      </div>
    )
  }

  const responses = interview.responses
  const resp = responses[current]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold capitalize">
          {interview.interview_type} Interview
        </h1>

        <div className="flex gap-3">
          <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full font-mono">
            Session: {formatTime(sessionSeconds)}
          </span>

          <span
            className={`px-4 py-2 rounded-full font-bold ${
              questionSeconds <= 10
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {questionSeconds}s
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              LIVE
            </span>
          </div>
        </div>

        <div className="md:col-span-2">
          <motion.div
            key={resp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border"
          >
            <p className="text-gray-400 mb-2">
              Question {current + 1} of {responses.length}
            </p>

            <h2 className="text-xl font-semibold mb-4">
              {resp.question_text}
            </h2>

            <button
              onClick={() =>
                speakQuestion(resp.question_text)
              }
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl mb-4 hover:bg-blue-700"
            >
              <FiVolume2 />
              Repeat Question
            </button>

            {!browserSupportsSpeechRecognition && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                Speech Recognition is not supported in this browser.
              </div>
            )}

            <textarea
              rows={8}
              value={answerText}
              onChange={(e) =>
                setAnswerText(e.target.value)
              }
              placeholder="Speak or type your answer here..."
              className="w-full border rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="flex gap-3 mt-4 flex-wrap">
              <button
                onClick={startRecording}
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                🎤 Start Recording
              </button>

              <button
                onClick={stopRecording}
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                ⏹ Stop Recording
              </button>

              <div className="flex items-center text-sm">
                {listening ? (
                  <span className="text-green-600 font-semibold">
                    🎙 Listening...
                  </span>
                ) : (
                  <span className="text-gray-500">
                    Microphone Idle
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                disabled={submitting}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {submitting
                  ? 'Saving...'
                  : current <
                    responses.length - 1
                  ? 'Next Question'
                  : 'Finish Interview'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}