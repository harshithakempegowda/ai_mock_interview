import { useEffect, useState } from 'react'

export function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start = null
    const numericTarget = Number(target) || 0
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setValue(Math.floor(progress * numericTarget))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(numericTarget)
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return value
}
