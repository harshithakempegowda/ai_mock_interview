import { useEffect, useRef, useState } from 'react'

export function useMediaDevices() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [permissionGranted, setPermissionGranted] = useState(false)
  const [error, setError] = useState(null)

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      streamRef.current = stream

      setPermissionGranted(true)
      setError(null)

      return stream
    } catch (err) {
      console.error(err)
      setError('Camera and microphone access is required to start the interview.')
      setPermissionGranted(false)
      throw err
    }
  }

  useEffect(() => {
    if (permissionGranted && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [permissionGranted])

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  return {
    videoRef,
    permissionGranted,
    error,
    requestPermissions,
    stopStream,
  }
}