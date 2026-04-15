import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import DiffCheckerTool from '#/components/tools/diff-checker'

const diffSearchSchema = z.object({
  strategy: z.enum(['line', 'word', 'char']).default('line').catch('line'),
  ignoreCase: z.boolean().default(false).catch(false),
  ignoreWS: z.boolean().default(false).catch(false),
  showWS: z.boolean().default(false).catch(false),
  wrap: z.boolean().default(false).catch(false),
})

export type DiffSearchParams = z.infer<typeof diffSearchSchema>

export const Route = createFileRoute('/_tools/diff-checker')({
  validateSearch: diffSearchSchema,
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
