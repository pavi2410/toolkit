import { useState, useCallback } from 'react'
import { actions } from '@/stores/image-editor'
import SharedDropZone from '@/components/DropZone'
import IconPhoto from '~icons/tabler/photo'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp']

export default function DropZone() {
  const [error, setError] = useState<string | null>(null)

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
    />
  )
}
