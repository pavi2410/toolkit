import type { ReactNode } from 'react'
import { Surface } from '@heroui/react'
import IconFileDiff from '~icons/tabler/file-diff'
import IconCircleCheck from '~icons/tabler/circle-check'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actions?: ReactNode
}

export default function EmptyState({ icon, title, description, actions }: EmptyStateProps) {
  const Icon = icon === 'compare' ? IconFileDiff : IconCircleCheck

  return (
    <div className="flex flex-1 items-center justify-center bg-surface-secondary p-6">
      <Surface className="max-w-md space-y-4 rounded-3xl px-10 py-8 text-center shadow-none">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-default text-muted">
            <Icon className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">{title}</p>
            <p className="text-sm leading-6 text-muted">{description}</p>
          </div>
          {actions ? <div className="flex justify-center">{actions}</div> : null}
      </Surface>
    </div>
  )
}
