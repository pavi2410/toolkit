import { createFileRoute } from '@tanstack/react-router'
import DecoTool from '#/components/tools/deco'

export const Route = createFileRoute('/_tools/deco')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Deco | Toolkit' },
      {
        name: 'description',
        content:
          'Prototype small HTML, CSS, and JavaScript ideas with a live in-browser preview and console.',
      },
    ],
  }),
  component: DecoTool,
})