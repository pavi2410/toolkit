import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  FileType2,
  GitCompare,
  Image as ImageIcon,
  Tag,
} from 'lucide-react'

const tools = [
  {
    name: 'Diff Checker',
    description:
      'Compare text differences with line, word, or character-level strategies.',
    to: '/tools/diff-checker',
    Icon: GitCompare,
    tags: ['Text', 'Comparison', 'Developer Tools'],
  },
  {
    name: 'Image Editor',
    description:
      'Resize, crop, and convert images fully in your browser with privacy-first processing.',
    to: '/tools/image-editor',
    Icon: ImageIcon,
    tags: ['Image', 'Converter', 'Editor'],
  },
  {
    name: 'PDF Editor',
    description:
      'Merge, split, rotate, reorder, and unlock PDFs directly in your browser.',
    to: '/tools/pdf-editor',
    Icon: FileType2,
    tags: ['PDF', 'Converter', 'Editor'],
  },
  {
    name: 'Name Checker',
    description:
      'Check project-name availability across platforms and domains for your next build.',
    to: '/tools/name-checker',
    Icon: Tag,
    tags: ['Brand', 'Domain', 'Developer Tools'],
  },
] as const

export const Route = createFileRoute('/tools')({
  head: () => ({
    meta: [
      {
        title: 'Toolkit | pavi2410',
      },
      {
        name: 'description',
        content: 'A collection of practical tools for everyday development workflows.',
      },
    ],
  }),
  component: ToolsPage,
})

function ToolsPage() {
  return (
    <main className="page-wrap px-4 py-10">
      <section className="island-shell rounded-[2rem] p-6 sm:p-8">
        <h1 className="display-title text-4xl leading-tight font-bold text-(--sea-ink) sm:text-5xl">
          Toolkit
        </h1>
        <p className="mt-3 max-w-2xl text-(--sea-ink-soft)">
          Purpose-built utilities extracted into a dedicated toolkit site.
        </p>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {tools.map(({ name, description, to, Icon, tags }) => (
          <Link
            key={to}
            to={to}
            className="island-shell group block rounded-2xl p-5 no-underline transition hover:-translate-y-0.5"
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
        ))}
      </section>
    </main>
  )
}
