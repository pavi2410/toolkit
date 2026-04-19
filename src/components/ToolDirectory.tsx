import { Chip, Surface } from '@heroui/react'
import { Link, useRouterState } from '@tanstack/react-router'
import IconArrowRight from '~icons/tabler/arrow-right'
import IconCode from '~icons/tabler/code'
import IconFileTypePdf from '~icons/tabler/file-type-pdf'
import IconGitCompare from '~icons/tabler/git-compare'
import IconPhoto from '~icons/tabler/photo'
import IconTag from '~icons/tabler/tag'

export const toolItems = [
  {
    name: 'Diff Checker',
    description: 'Compare text differences with line, word, or character-level strategies.',
    to: '/diff-checker',
    Icon: IconGitCompare,
    tags: ['Text', 'Comparison'],
    eyebrow: 'Review Changes',
  },
  {
    name: 'Image Editor',
    description: 'Resize, crop, and convert images fully in your browser.',
    to: '/image-editor',
    Icon: IconPhoto,
    tags: ['Image', 'Editor'],
    eyebrow: 'Prep Assets',
  },
  {
    name: 'Deco',
    description: 'Edit HTML, CSS, and JavaScript together with a live browser preview.',
    to: '/deco',
    Icon: IconCode,
    tags: ['Code', 'Preview'],
    eyebrow: 'Prototype Fast',
  },
  {
    name: 'PDF Editor',
    description: 'Merge, split, rotate, reorder, and unlock PDFs in-browser.',
    to: '/pdf-editor',
    Icon: IconFileTypePdf,
    tags: ['PDF', 'Editor'],
    eyebrow: 'Assemble Documents',
  },
  {
    name: 'Name Checker',
    description: 'Check project-name availability across platforms and domains.',
    to: '/name-checker',
    Icon: IconTag,
    tags: ['Brand', 'Domain'],
    eyebrow: 'Claim a Name',
  },
] as const

export function getToolByPath(pathname: string) {
  return toolItems.find(({ to }) => pathname === to || pathname.startsWith(`${to}/`))
}

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
      {toolItems.map(({ name, description, to, Icon, tags, eyebrow }) => {
        const isActive = pathname === to

        return (
          <Link key={to} to={to} className="group block no-underline">
            <Surface
              variant={isActive ? 'secondary' : 'default'}
              className="h-full space-y-3 rounded-3xl p-4 shadow-none transition-transform duration-200 group-hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-secondary">
                  <Icon aria-hidden="true" className="h-4.5 w-4.5 text-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {eyebrow}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground">{name}</h3>
                </div>
                <IconArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
              </div>

              <div className={isList ? '' : 'pb-1'}>
                <p className="text-sm text-muted">
                  {description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Chip key={tag} color="default" size="sm" variant="soft">
                    <Chip.Label>{tag}</Chip.Label>
                  </Chip>
                ))}
                {isActive && (
                  <Chip color="accent" size="sm" variant="soft">
                    <Chip.Label>Current</Chip.Label>
                  </Chip>
                )}
              </div>
            </Surface>
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
