import { createFileRoute } from '@tanstack/react-router'
import PdfEditorTool from '#/components/tools/pdf-editor'

export const Route = createFileRoute('/_tools/pdf-editor')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'PDF Editor | Toolkit' },
      {
        name: 'description',
        content:
          'Merge, split, rotate, reorder, and unlock PDF files directly in your browser.',
      },
    ],
  }),
  component: PdfEditorTool,
})
