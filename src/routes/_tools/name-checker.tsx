import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import NameCheckerTool from '#/components/tools/name-checker'

const nameSearchSchema = z.object({
  name: z.string().default('').catch(''),
})

export type NameSearchParams = z.infer<typeof nameSearchSchema>

export const Route = createFileRoute('/_tools/name-checker')({
  validateSearch: nameSearchSchema,
  head: () => ({
    meta: [
      { title: 'Name Checker | Toolkit' },
      {
        name: 'description',
        content:
          'Check name availability across package registries, code platforms, and domains.',
      },
    ],
  }),
  component: NameCheckerTool,
})
