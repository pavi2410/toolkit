import { useCallback, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { computeDiff, groupIntoHunks, formatAsUnifiedDiff } from '@/utils/diff'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import Toolbar from './Toolbar'
import DiffViewer from './DiffViewer'

const routeApi = getRouteApi('/_tools/diff-checker')

function calculateDiffStats(hunkCount: number, hunks: ReturnType<typeof groupIntoHunks>) {
  let additions = 0
  let deletions = 0

  for (const hunk of hunks) {
    for (const change of hunk.changes) {
      if (change.type === 'add') additions++
      if (change.type === 'remove') deletions++
    }
  }

  return {
    hunkCount,
    additions,
    deletions
  }
}

export default function DiffChecker() {
  const [textA, setTextAStorage, textARef] = useSessionStorage('diff-checker:textA', '')
  const [textB, setTextBStorage, textBRef] = useSessionStorage('diff-checker:textB', '')

  const { wrap: lineWrap } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const setLineWrap = useCallback((v: boolean) => {
    navigate({ search: (prev) => ({ ...prev, wrap: v }) })
  }, [navigate])

  const [copySuccess, setCopySuccess] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const setTextA = useCallback((value: string) => {
    if (value !== textARef.current) setTextAStorage(value)
  }, [setTextAStorage, textARef])

  const setTextB = useCallback((value: string) => {
    if (value !== textBRef.current) setTextBStorage(value)
  }, [setTextBStorage, textBRef])

  const handleLoadExample = useCallback(() => {
    setTextAStorage(['const config = {', '  retries: 3,', '  timeout: 5000,', '}', ''].join('\n'))
    setTextBStorage(['const config = {', '  retries: 5,', '  timeout: 3000,', '  cache: true,', '}', ''].join('\n'))
  }, [setTextAStorage, setTextBStorage])

  const handleClear = useCallback(() => {
    setTextAStorage('')
    setTextBStorage('')
  }, [setTextAStorage, setTextBStorage])

  const diffChanges = useMemo(() => {
    if (!textA && !textB) return []
    return computeDiff(textA, textB, {
      strategy: 'line',
      ignoreCase: false,
      ignoreWhitespace: false
    })
  }, [textA, textB])

  const hunks = useMemo(() => {
    return groupIntoHunks(diffChanges, 'line', 3)
  }, [diffChanges])

  const diffStats = useMemo(() => calculateDiffStats(hunks.length, hunks), [hunks])

  const handleSwap = useCallback(() => {
    setTextAStorage(textB)
    setTextBStorage(textA)
  }, [setTextAStorage, setTextBStorage, textA, textB])

  const handleCopyDiff = useCallback(async () => {
    const unifiedDiff = formatAsUnifiedDiff(hunks)
    try {
      await navigator.clipboard.writeText(unifiedDiff)
      setCopySuccess(true)
      setCopyError(false)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 3000)
      console.error('Failed to copy:', err)
    }
  }, [hunks])

  return (
    <div className="flex h-full min-w-0 w-full flex-col bg-surface-secondary">
      <Toolbar
        lineWrap={lineWrap}
        onLineWrapChange={setLineWrap}
        onSwap={handleSwap}
        onCopyDiff={handleCopyDiff}
        copySuccess={copySuccess}
        copyError={copyError}
        canCopy={hunks.length > 0}
        onLoadExample={handleLoadExample}
        onClear={handleClear}
        canClear={Boolean(textA || textB)}
        additions={diffStats.additions}
        deletions={diffStats.deletions}
      />

      <DiffViewer
        originalText={textA}
        modifiedText={textB}
        lineWrap={lineWrap}
        onOriginalChange={setTextA}
        onModifiedChange={setTextB}
      />
    </div>
  )
}
