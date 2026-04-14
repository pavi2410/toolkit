import { Link, useRouterState } from '@tanstack/react-router'
import {
  ArrowRight,
  FileType2,
  GitCompare,
  Image as ImageIcon,
  Tag,
} from 'lucide-react'

const toolItems = [
  {
    name: 'Diff Checker',
    description:
      'Compare text differences with line, word, or character-level strategies.',
    to: '/diff-checker',
    Icon: GitCompare,
    tags: ['Text', 'Comparison', 'Developer Tools'],
  },
  {
    name: 'Image Editor',
    description:
      'Resize, crop, and convert images fully in your browser with privacy-first processing.',
    to: '/image-editor',
    Icon: ImageIcon,
    tags: ['Image', 'Converter', 'Editor'],
  },
  {
    name: 'PDF Editor',
    description:
      'Merge, split, rotate, reorder, and unlock PDFs directly in your browser.',
    to: '/pdf-editor',
    Icon: FileType2,
    tags: ['PDF', 'Converter', 'Editor'],
  },
  {
    name: 'Name Checker',
    description:
      'Check project-name availability across platforms and domains for your next build.',
    to: '/name-checker',
    Icon: Tag,
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
    <div>
      <div
        className={`grid gap-4 ${
          isStack ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {toolItems.map(({ name, description, to, Icon, tags }) => {
          const isActive = pathname === to

          return (
            <Link
              key={to}
              to={to}
              className={`island-shell group block rounded-2xl p-5 no-underline transition hover:-translate-y-0.5 ${
                isActive
                  ? 'border-[rgba(50,143,151,0.34)] bg-[rgba(79,184,178,0.16)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[rgba(79,184,178,0.15)] p-2.5 text-(--lagoon-deep)">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-(--sea-ink)">{name}</h2>
                    <p className="mt-1 text-sm text-(--sea-ink-soft)">{description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-(--sea-ink-soft) transition group-hover:translate-x-0.5" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-2.5 py-1 text-xs font-medium text-(--sea-ink-soft)"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function ToolPageShell({ children }: ToolPageShellProps) {
  return (
    <main className="page-wrap px-4 py-6 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-6">
          <ToolDirectory layout="stack" />
        </aside>
        <section className="island-shell min-h-[75vh] overflow-hidden rounded-[2rem]">
          {children}
        </section>
      </div>
    </main>
  )
}
