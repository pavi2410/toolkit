import type { ReactNode } from 'react'

interface ToolPageToolbarProps {
  children: ReactNode
}

export function ToolPageToolbar({ children }: ToolPageToolbarProps) {
  return (
    <div className="shrink-0 border-b border-border bg-surface px-3 py-2 sm:px-4">
      {children}
    </div>
  )
}
