import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import NameCheckerTool from '#/components/tools/name-checker'
import { seo } from '#/utils/seo'

const nameSearchSchema = z.object({
  name: z.string().default('').catch(''),
})

export type NameSearchParams = z.infer<typeof nameSearchSchema>

export const Route = createFileRoute('/_tools/name-checker')({
  validateSearch: nameSearchSchema,
  head: () =>
    seo({
      title: 'Name Checker | Toolkit',
      description:
        'Check name availability across package registries, code platforms, and domains.',
      path: '/name-checker',
    }),
  component: NameCheckerTool,
})
