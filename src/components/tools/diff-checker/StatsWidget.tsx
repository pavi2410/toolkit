import { Chip } from '@heroui/react'

interface StatsWidgetProps {
  text: string
  label?: string
}

function calculateStats(text: string) {
  const chars = text.length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const lines = text ? text.split('\n').length : 0
  const bytes = new Blob([text]).size

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return { chars, words, lines, size: formatBytes(bytes) }
}

export default function StatsWidget({ text, label }: StatsWidgetProps) {
  const stats = calculateStats(text)

  return (
    <div className="flex items-center gap-1.5">
      {label && <span className="text-xs font-medium text-muted mr-1">{label}</span>}
      <Chip size="sm" variant="soft" title="Lines">{stats.lines}L</Chip>
      <Chip size="sm" variant="soft" title="Words">{stats.words}W</Chip>
      <Chip size="sm" variant="soft" title="Characters">{stats.chars}C</Chip>
      <Chip size="sm" variant="soft" title="Size">{stats.size}</Chip>
    </div>
  )
}
