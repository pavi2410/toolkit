import { createFileRoute } from '@tanstack/react-router'
import SplitTool from '#/components/tools/split'
import { seo } from '#/utils/seo'

export const Route = createFileRoute('/_tools/split')({
  ssr: false,
  head: () =>
    seo({
      title: 'Split | Toolkit',
      description:
        'Split shared expenses with friends and see who owes whom, right in your browser.',
      path: '/split',
    }),
  component: SplitTool,
})
