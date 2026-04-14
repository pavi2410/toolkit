import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import ImageEditorTool from '#/components/tools/image-editor'

export const Route = createFileRoute('/tools/image-editor')({
  head: () => ({
    meta: [
      { title: 'Image Editor | Toolkit' },
      {
        name: 'description',
        content:
          'Resize, crop, adjust, and convert images locally in your browser with privacy-first processing.',
      },
    ],
  }),
  component: ImageEditorPage,
})

function ImageEditorPage() {
  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-950">
      <div className="shrink-0 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/tools"
              className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title="Back to tools"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Image Editor</h1>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ImageEditorTool />
      </div>
    </div>
  )
}
