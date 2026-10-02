import { createFileRoute } from '@tanstack/react-router'
import PdfEditorTool from '#/components/tools/pdf-editor'
import { seo } from '#/utils/seo'

export const Route = createFileRoute('/_tools/pdf-editor')({
  ssr: false,
  head: () =>
    seo({
      title: 'PDF Editor | Toolkit',
      description:
        'Merge, split, rotate, reorder, and unlock PDF files directly in your browser.',
      path: '/pdf-editor',
    }),
  component: PdfEditorTool,
})
