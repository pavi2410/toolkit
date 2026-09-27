import { useState, useCallback } from 'react'
import { Button } from '@heroui/react'
import { actions } from '@/stores/image-editor'
import SharedDropZone from '@/components/DropZone'
import IconPhoto from '~icons/tabler/photo'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp']
const EXAMPLE_URL = 'https://picsum.photos/seed/toolkit/1600/1067.jpg'

export default function DropZone() {
  const [error, setError] = useState<string | null>(null)
  const [isLoadingExample, setIsLoadingExample] = useState(false)

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null)
    const file = files[0]
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please use PNG, JPG, WEBP, GIF, or BMP.')
      return
    }
    try {
      await actions.loadImage(file)
    } catch (e) {
      setError('Failed to load image. The file may be corrupted.')
      console.error(e)
    }
  }, [])

  const loadExample = useCallback(async () => {
    setError(null)
    setIsLoadingExample(true)
    try {
      const res = await fetch(EXAMPLE_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      await actions.loadImage(new File([blob], 'example.jpg', { type: blob.type || 'image/jpeg' }))
    } catch (e) {
      setError('Failed to load example image.')
      console.error(e)
    } finally {
      setIsLoadingExample(false)
    }
  }, [])

  return (
    <SharedDropZone
      icon={<IconPhoto className="w-10 h-10" />}
      title="Drop an image or click to upload"
      dragTitle="Drop image here"
      subtitle="PNG, JPG, WEBP, GIF, BMP • Paste from clipboard supported"
      accept={ACCEPTED_TYPES.join(',')}
      supportsPaste
      onFiles={handleFiles}
      error={error}
      actions={
        <Button size="sm" variant="tertiary" isPending={isLoadingExample} onPress={loadExample}>
          Load example
        </Button>
      }
    />
  )
}
