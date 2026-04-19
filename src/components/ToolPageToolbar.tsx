import type { ReactNode } from 'react'

interface ToolPageToolbarProps {
  children: ReactNode
}

export function ToolPageToolbar({ children }: ToolPageToolbarProps) {
  return (
    <div className="shrink-0 border-b border-border bg-surface px-4 py-2">
      {children}
    </div>
  )
}
