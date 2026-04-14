import { Card } from '@heroui/react'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface-secondary">
      <Card.Root variant="default" className="text-center max-w-md px-10 py-8">
        <Card.Content>
          <div className="text-4xl mb-3">{icon}</div>
          <p className="text-sm font-medium text-foreground mb-1">{title}</p>
          <p className="text-xs text-muted">{description}</p>
        </Card.Content>
      </Card.Root>
    </div>
  )
}
