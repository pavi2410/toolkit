import { useEffect, useState } from 'react'
import { useStore } from '@nanostores/react'
import { $originalImage, actions } from '@/stores/image-editor'
import { Spinner } from '@heroui/react'
import DropZone from './DropZone'
import Toolbar from './Toolbar'
import Sidebar from './Sidebar'
import ImageCanvas from './ImageCanvas'
import ImageInfo from './ImageInfo'

export default function ImageEditorApp() {
  const originalImage = useStore($originalImage)
  const [isRestoring, setIsRestoring] = useState(true)

  useEffect(() => {
    actions.restoreFromStorage().finally(() => setIsRestoring(false))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); actions.undo() }
      else if (isMod && e.key === 'z' && e.shiftKey) { e.preventDefault(); actions.redo() }
      else if (isMod && e.key === 'y') { e.preventDefault(); actions.redo() }
      else if (isMod && e.key === 's') { e.preventDefault(); actions.setPanel('format') }
      else if (e.key === '0' && isMod) { e.preventDefault(); actions.setZoom(1) }
      else if (e.code === 'Digit1' && e.shiftKey && !isMod) { e.preventDefault(); actions.setZoomMode('fit') }
      else if (e.key === '=' && isMod) { e.preventDefault(); actions.zoomIn() }
      else if (e.key === '-' && isMod) { e.preventDefault(); actions.zoomOut() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (isRestoring) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-secondary">
        <Spinner size="lg" color="accent" />
      </div>
    )
  }

  if (!originalImage) return <DropZone />

  return (
    <div className="flex h-full min-w-0 w-full flex-col bg-surface-secondary">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ImageCanvas />
          <ImageInfo />
        </div>
      </div>
    </div>
  )
}
