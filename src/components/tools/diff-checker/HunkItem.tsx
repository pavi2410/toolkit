import { computeInlineDiff, type DiffHunk, type DiffChange } from '@/utils/diff'

interface HunkItemProps {
  hunk: DiffHunk
  index: number
  isExpanded: boolean
  onToggle: (index: number) => void
  formatText: (text: string) => string
  strategy: 'line' | 'word' | 'char'
}

interface LineRenderInfo {
  change: DiffChange
  inlineDiff?: {
    segments: Array<{ text: string; changed: boolean }>
  }
}

function prepareLineData(changes: DiffChange[], strategy: string): LineRenderInfo[] {
  const result: LineRenderInfo[] = []

  if (strategy === 'line') {
    for (let i = 0; i < changes.length; i++) {
      const current = changes[i]
      const next = changes[i + 1]

      if (current.type === 'remove' && next && next.type === 'add') {
        const { oldSegments, newSegments } = computeInlineDiff(current.value, next.value)
        result.push({ change: current, inlineDiff: { segments: oldSegments } })
        result.push({ change: next, inlineDiff: { segments: newSegments } })
        i++
      } else {
        result.push({ change: current })
      }
    }
  } else {
    result.push(...changes.map(change => ({ change })))
  }

  return result
}

export default function HunkItem({ hunk, index, isExpanded, onToggle, formatText, strategy }: HunkItemProps) {
  const lineData = prepareLineData(hunk.changes, strategy)
  const changeCount = hunk.changes.filter(c => c.type !== 'unchanged').length

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Hunk header */}
      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={isExpanded}
        aria-label="Toggle hunk"
        className="w-full text-left flex items-center bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border-b border-blue-200 dark:border-blue-800/60"
      >
        <div className="w-24 shrink-0 flex items-center justify-center py-1.5 border-r border-blue-200 dark:border-blue-800/60 text-blue-500 dark:text-blue-400 text-xs select-none">
          {isExpanded ? '▾' : '▸'}
        </div>
        <div className="flex items-center gap-3 px-3 py-1.5 min-w-0">
          <span className="font-mono text-xs text-blue-700 dark:text-blue-300 truncate">
            {hunk.header}
          </span>
          <span className="shrink-0 text-xs text-blue-400 dark:text-blue-500">
            {changeCount} {changeCount === 1 ? 'change' : 'changes'}
          </span>
        </div>
      </button>

      {/* Hunk content */}
      {isExpanded && (
        <div className="font-mono text-xs">
          {lineData.map((item, changeIndex) => {
            const { change, inlineDiff } = item
            const isAdd = change.type === 'add'
            const isRemove = change.type === 'remove'

            const rowBg = isAdd
              ? 'bg-green-50 dark:bg-green-500/10'
              : isRemove
              ? 'bg-red-50 dark:bg-red-500/10'
              : 'bg-surface'

            const gutterBg = isAdd
              ? 'bg-green-100 dark:bg-green-500/20'
              : isRemove
              ? 'bg-red-100 dark:bg-red-500/20'
              : 'bg-surface-secondary'

            const prefixColor = isAdd
              ? 'text-green-600 dark:text-green-400 font-bold'
              : isRemove
              ? 'text-red-600 dark:text-red-400 font-bold'
              : 'text-muted'

            const prefix = isAdd ? '+' : isRemove ? '-' : ' '

            const wordHighlight = isAdd
              ? 'bg-green-200 dark:bg-green-400/25 rounded-sm'
              : 'bg-red-200 dark:bg-red-400/25 rounded-sm'

            return (
              <div
                key={changeIndex}
                className={`flex items-stretch ${rowBg} border-b border-border/40 last:border-b-0`}
              >
                {/* Old line number */}
                <div className={`w-10 px-1.5 py-0.5 text-right select-none border-r border-border/50 text-muted/60 ${gutterBg}`}>
                  {isAdd ? '' : change.lineNumber?.old}
                </div>
                {/* New line number */}
                <div className={`w-10 px-1.5 py-0.5 text-right select-none border-r border-border/50 text-muted/60 ${gutterBg}`}>
                  {isRemove ? '' : change.lineNumber?.new}
                </div>
                {/* Prefix */}
                <div className={`w-5 py-0.5 flex items-center justify-center select-none ${prefixColor} ${gutterBg} border-r border-border/50`}>
                  {prefix}
                </div>
                {/* Content */}
                <div className="flex-1 py-0.5 px-3 whitespace-pre-wrap break-all text-foreground leading-5">
                  {inlineDiff ? (
                    inlineDiff.segments.map((segment, segIndex) => (
                      <span key={segIndex} className={segment.changed ? wordHighlight : ''}>
                        {formatText(segment.text)}
                      </span>
                    ))
                  ) : (
                    formatText(change.value)
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
