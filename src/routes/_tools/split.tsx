import { createFileRoute } from '@tanstack/react-router'
import SplitTool from '#/components/tools/split'

export const Route = createFileRoute('/_tools/split')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Split | Toolkit' },
      {
        name: 'description',
        content: 'Split shared expenses with friends and see who owes whom, right in your browser.',
      },
    ],
  }),
  component: SplitTool,
})
