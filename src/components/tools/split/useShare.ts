import { useCallback, useRef, useState } from 'react'
import { MAX_URL, encodeState } from './share'
import type { SplitState } from './types'

export type ShareStatus = 'idle' | 'copied' | 'failed' | 'long'

export function useShare(state: SplitState) {
  const [status, setStatus] = useState<ShareStatus>('idle')
  const timer = useRef<number>(undefined)

  const flash = (s: ShareStatus) => {
    setStatus(s)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), 2000)
  }

  const copy = useCallback(async () => {
    try {
      const url = `${location.origin}${location.pathname}#s=${await encodeState(state)}`
      if (url.length > MAX_URL) return flash('long')
      await navigator.clipboard.writeText(url)
      flash('copied')
    } catch {
      flash('failed')
    }
  }, [state])

  return { status, copy }
}
