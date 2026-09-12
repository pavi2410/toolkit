import type { ComponentType, ReactNode, SVGProps } from 'react'

interface PanelHeaderProps {
  title: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  children?: ReactNode
}

export default function PanelHeader({ title, icon: Icon, children }: PanelHeaderProps) {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-2">
      <div className="flex items-center gap-1.5 pl-1 text-xs font-medium text-muted">
        <Icon className="h-3.5 w-3.5" />
        <span>{title}</span>
      </div>
      {children && <div className="flex items-center gap-1">{children}</div>}
    </div>
  )
}
