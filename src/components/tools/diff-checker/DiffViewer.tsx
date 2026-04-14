import HunkItem from './HunkItem'
import type { DiffHunk } from '@/utils/diff'
import { Button, Chip, Toolbar } from '@heroui/react'

interface DiffViewerProps {
  hunks: DiffHunk[]
  expandedHunks: Set<number>
  onToggleHunk: (index: number) => void
  onExpandAll: () => void
  onCollapseAll: () => void
  formatText: (text: string) => string
  strategy: 'line' | 'word' | 'char'
}

function calculateDiffStats(hunks: DiffHunk[]) {
  let additions = 0
  let deletions = 0

  for (const hunk of hunks) {
    for (const change of hunk.changes) {
      if (change.type === 'add') additions++
      else if (change.type === 'remove') deletions++
    }
  }

  return { additions, deletions }
}

export default function DiffViewer({
  hunks,
  expandedHunks,
  onToggleHunk,
  onExpandAll,
  onCollapseAll,
  formatText,
  strategy
}: DiffViewerProps) {
  const stats = calculateDiffStats(hunks)

  return (
    <div className="flex-1 flex flex-col overflow-hidden border-t border-border">
      {/* Diff header */}
      <Toolbar
        aria-label="Diff controls"
        className="shrink-0 px-4 py-2 bg-surface-secondary border-b border-border flex items-center gap-3"
      >
        <span className="text-xs font-semibold text-muted uppercase tracking-widest">Diff</span>

        <Chip size="sm" variant="soft">
          {hunks.length} {hunks.length === 1 ? 'hunk' : 'hunks'}
        </Chip>

        {(stats.additions > 0 || stats.deletions > 0) && (
          <>
            <Chip size="sm" variant="soft" color="success">+{stats.additions}</Chip>
            <Chip size="sm" variant="soft" color="danger">−{stats.deletions}</Chip>
          </>
        )}

        <div className="flex-1" />

        <Button size="sm" variant="tertiary" onPress={onExpandAll}>Expand all</Button>
        <Button size="sm" variant="tertiary" onPress={onCollapseAll}>Collapse all</Button>
      </Toolbar>

      {/* Hunks */}
      <div className="flex-1 overflow-y-auto">
        {hunks.map((hunk, index) => (
          <HunkItem
            key={index}
            hunk={hunk}
            index={index}
            isExpanded={expandedHunks.has(index)}
            onToggle={onToggleHunk}
            formatText={formatText}
            strategy={strategy}
          />
        ))}
      </div>
    </div>
  )
}
