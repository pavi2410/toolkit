import { createFileRoute } from '@tanstack/react-router'
import DiffCheckerTool from '#/components/tools/diff-checker'

export const Route = createFileRoute('/_tools/diff-checker')({
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
  component: DiffCheckerTool,
})
