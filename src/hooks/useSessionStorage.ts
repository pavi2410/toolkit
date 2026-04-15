import { useState, useCallback, useRef } from 'react'

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = sessionStorage.getItem(key)
      if (raw) return JSON.parse(raw) as T
    } catch {}
    return initialValue
  })

  const valueRef = useRef(value)
  valueRef.current = value

  const set = useCallback((update: T | Partial<T>) => {
    setValue(prev => {
      const next = typeof prev === 'object' && prev !== null && typeof update === 'object' && update !== null
        ? { ...prev, ...update }
        : update as T
      sessionStorage.setItem(key, JSON.stringify(next))
      return next
    })
  }, [key])

  return [value, set, valueRef] as const
}
