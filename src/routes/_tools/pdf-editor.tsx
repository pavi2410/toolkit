import { createFileRoute } from '@tanstack/react-router'
import PdfEditorTool from '#/components/tools/pdf-editor'

export const Route = createFileRoute('/_tools/pdf-editor')({
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
  component: PdfEditorPage,
})

function PdfEditorPage() {
  return (
    <div className="h-full min-h-[75vh] overflow-hidden">
      <PdfEditorTool />
    </div>
  )
}