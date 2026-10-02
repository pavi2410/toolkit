import { createFileRoute } from '@tanstack/react-router'
import DecoTool from '#/components/tools/deco'
import { seo } from '#/utils/seo'

export const Route = createFileRoute('/_tools/deco')({
  ssr: false,
  head: () =>
    seo({
      title: 'Deco | Toolkit',
      description:
        'Prototype small HTML, CSS, and JavaScript ideas with a live in-browser preview and console.',
      path: '/deco',
    }),
  component: DecoTool,
})