import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import DiffCheckerTool from '#/components/tools/diff-checker'
import { seo } from '#/utils/seo'

const diffSearchSchema = z.object({
  wrap: z.boolean().default(false).catch(false),
})

export type DiffSearchParams = z.infer<typeof diffSearchSchema>

export const Route = createFileRoute('/_tools/diff-checker')({
  ssr: false,
  validateSearch: diffSearchSchema,
  head: () =>
    seo({
      title: 'Diff Checker | Toolkit',
      description:
        'Compare text with CodeMirror editors and a GitHub-style unified diff view.',
      path: '/diff-checker',
    }),
  component: DiffCheckerTool,
})
