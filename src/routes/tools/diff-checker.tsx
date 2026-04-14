import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import DiffCheckerTool from '#/components/tools/diff-checker'

export const Route = createFileRoute('/tools/diff-checker')({
  head: () => ({
    meta: [
      { title: 'Diff Checker | Toolkit' },
      {
        name: 'description',
        content:
          'Compare text with line, word, or character-level strategies including unified diff export.',
      },
    ],
  }),
  component: DiffCheckerPage,
})

function DiffCheckerPage() {
  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-950">
      <div className="shrink-0 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/tools"
              className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title="Back to tools"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Diff Checker</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Compare text differences</p>
            </div>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            toolkit.pavi2410.com
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <DiffCheckerTool />
      </div>
    </div>
  )
}
