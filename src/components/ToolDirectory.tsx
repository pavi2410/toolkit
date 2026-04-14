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
    description:
      'Compare text differences with line, word, or character-level strategies.',
    to: '/diff-checker',
    Icon: IconGitCompare,
    tags: ['Text', 'Comparison', 'Developer Tools'],
  },
  {
    name: 'Image Editor',
    description:
      'Resize, crop, and convert images fully in your browser with privacy-first processing.',
    to: '/image-editor',
    Icon: IconPhoto,
    tags: ['Image', 'Converter', 'Editor'],
  },
  {
    name: 'PDF Editor',
    description:
      'Merge, split, rotate, reorder, and unlock PDFs directly in your browser.',
    to: '/pdf-editor',
    Icon: IconFileTypePdf,
    tags: ['PDF', 'Converter', 'Editor'],
  },
  {
    name: 'Name Checker',
    description:
      'Check project-name availability across platforms and domains for your next build.',
    to: '/name-checker',
    Icon: IconTag,
    tags: ['Brand', 'Domain', 'Developer Tools'],
  },
] as const

interface ToolDirectoryProps {
  layout?: 'grid' | 'stack'
}

interface ToolPageShellProps {
  children: React.ReactNode
}

export function ToolDirectory({ layout = 'grid' }: ToolDirectoryProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isStack = layout === 'stack'

  return (
    <div
      className={`grid gap-4 ${
        isStack ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
      }`}
    >
      {toolItems.map(({ name, description, to, Icon, tags }, index) => {
        const isActive = pathname === to

        return (
          <Link
            key={to}
            to={to}
            className="group block no-underline"
          >
            <Card
              variant={isActive ? 'secondary' : 'default'}
              className="h-full"
            >
              <Card.Header className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground/80">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-foreground/60">Tool {String(index + 1).padStart(2, '0')}</p>
                    <Card.Title className="text-lg font-semibold">
                      {name}
                    </Card.Title>
                  </div>
                </div>

                <IconArrowRight className="mt-1 h-4 w-4 shrink-0 text-foreground/50 transition group-hover:translate-x-1" />
              </Card.Header>

              <Card.Content>
                <Card.Description className="text-sm text-foreground/70">
                  {description}
                </Card.Description>
              </Card.Content>

              <Card.Footer className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      color="default"
                      size="sm"
                      variant="soft"
                    >
                      <Chip.Label>{tag}</Chip.Label>
                    </Chip>
                  ))}
                </div>

                <span className="text-sm font-medium text-foreground/70">
                  Open tool
                </span>
              </Card.Footer>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

export function ToolPageShell({ children }: ToolPageShellProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20">
          <Card>
            <Card.Header>
              <Card.Title>Tools</Card.Title>
              <Card.Description>Switch quickly between utilities.</Card.Description>
            </Card.Header>
            <Card.Content>
              <ToolDirectory layout="stack" />
            </Card.Content>
          </Card>
        </aside>

        <Card className="min-h-[75vh]">
          <Card.Content className="h-full p-0">{children}</Card.Content>
        </Card>
      </div>
    </main>
  )
}
