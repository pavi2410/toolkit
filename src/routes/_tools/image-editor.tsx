import { createFileRoute } from '@tanstack/react-router'
import ImageEditorTool from '#/components/tools/image-editor'

export const Route = createFileRoute('/_tools/image-editor')({
  ssr: false,
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
  component: ImageEditorTool,
})
