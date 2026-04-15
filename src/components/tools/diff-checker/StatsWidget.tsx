interface StatsWidgetProps {
  text: string
}

function calculateStats(text: string) {
  const lines = text ? text.split('\n').length : 0
  const bytes = new Blob([text]).size

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return { lines, size: formatBytes(bytes) }
}

export default function StatsWidget({ text }: StatsWidgetProps) {
  const stats = calculateStats(text)

  return (
    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
      <span>{stats.lines} lines</span>
      <span className="text-border">/</span>
      <span>{stats.size}</span>
    </div>
  )
}
