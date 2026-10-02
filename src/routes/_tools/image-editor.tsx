import { createFileRoute } from '@tanstack/react-router'
import ImageEditorTool from '#/components/tools/image-editor'
import { seo } from '#/utils/seo'

export const Route = createFileRoute('/_tools/image-editor')({
  ssr: false,
  head: () =>
    seo({
      title: 'Image Editor | Toolkit',
      description:
        'Resize, crop, adjust, and convert images locally in your browser with privacy-first processing.',
      path: '/image-editor',
    }),
  component: ImageEditorTool,
})
