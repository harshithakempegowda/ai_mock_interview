import { useCountUp } from '../hooks/useCountUp'

export default function AnimatedCounter({ value, suffix = '' }) {
  const count = useCountUp(value)
  return <span>{count}{suffix}</span>
}
