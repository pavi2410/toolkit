import { createFileRoute } from '@tanstack/react-router'
import DecoTool from '#/components/tools/deco'

export const Route = createFileRoute('/_tools/deco')({
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