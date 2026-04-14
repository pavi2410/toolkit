import { Card, Chip } from '@heroui/react'
import { Link, useRouterState } from '@tanstack/react-router'
import IconArrowRight from '~icons/tabler/arrow-right'
import IconFileTypePdf from '~icons/tabler/file-type-pdf'
import IconGitCompare from '~icons/tabler/git-compare'
import IconPhoto from '~icons/tabler/photo'
import IconTag from '~icons/tabler/tag'

const toolItems = [
  {
    name: 'Diff Checker',
    description: 'Compare text differences with line, word, or character-level strategies.',
    to: '/diff-checker',
    Icon: IconGitCompare,
    tags: ['Text', 'Comparison'],
  },
  {
    name: 'Image Editor',
    description: 'Resize, crop, and convert images fully in your browser.',
    to: '/image-editor',
    Icon: IconPhoto,
    tags: ['Image', 'Editor'],
  },
  {
    name: 'PDF Editor',
    description: 'Merge, split, rotate, reorder, and unlock PDFs in-browser.',
    to: '/pdf-editor',
    Icon: IconFileTypePdf,
    tags: ['PDF', 'Editor'],
  },
  {
    name: 'Name Checker',
    description: 'Check project-name availability across platforms and domains.',
    to: '/name-checker',
    Icon: IconTag,
    tags: ['Brand', 'Domain'],
  },
] as const

interface ToolDirectoryProps {
  layout?: 'grid' | 'list'
}

interface ToolPageShellProps {
  children: React.ReactNode
}

export function ToolDirectory({ layout = 'grid' }: ToolDirectoryProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isList = layout === 'list'

  return (
    <div
      className={`grid gap-3 ${
        isList ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
      }`}
    >
      {toolItems.map(({ name, description, to, Icon, tags }) => {
        const isActive = pathname === to

        return (
          <Link key={to} to={to} className="group block no-underline">
            <Card variant={isActive ? 'secondary' : 'default'} className="h-full transition-colors">
              <Card.Header className="flex-row items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
                  <Icon className="h-4.5 w-4.5 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <Card.Title className="text-sm font-semibold">{name}</Card.Title>
                  {!isList && (
                    <Card.Description className="text-xs text-muted">
                      {description}
                    </Card.Description>
                  )}
                </div>
                <IconArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
              </Card.Header>

              {!isList && (
                <Card.Footer className="gap-2 pt-0">
                  {tags.map((tag) => (
                    <Chip key={tag} color="default" size="sm" variant="soft">
                      <Chip.Label>{tag}</Chip.Label>
                    </Chip>
                  ))}
                </Card.Footer>
              )}
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

export function ToolPageShell({ children }: ToolPageShellProps) {
  return (
    <main className="flex-1">
      {children}
    </main>
  )
}
