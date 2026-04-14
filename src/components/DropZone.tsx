import { useRef, useState, useCallback, type ReactNode } from 'react'
import { Alert } from '@heroui/react'
import IconUpload from '~icons/tabler/upload'

interface DropZoneProps {
  /** Icon shown in the idle state */
  icon: ReactNode
  /** Heading shown in the idle state */
  title: string
  /** Heading shown while dragging (defaults to "Drop files here") */
  dragTitle?: string
  /** Hint line below the heading */
  subtitle: string
  /** Passed to the hidden <input accept="…"> */
  accept: string
  /** Allow selecting multiple files */
  multiple?: boolean
  /** Whether to listen for clipboard paste events */
  supportsPaste?: boolean
  /** Called with the FileList whenever files are provided */
  onFiles: (files: FileList) => void
  /** Controlled error message; null / undefined hides the alert */
  error?: string | null
}

export default function DropZone({
  icon,
  title,
  dragTitle = 'Drop files here',
  subtitle,
  accept,
  multiple = false,
  supportsPaste = false,
  onFiles,
  error,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files)
  }, [onFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (!supportsPaste) return
    const items = e.clipboardData.items
    const files = Array.from(items)
      .filter(item => item.kind === 'file')
      .map(item => item.getAsFile())
      .filter((f): f is File => f !== null)
    if (files.length) {
      const dt = new DataTransfer()
      files.forEach(f => dt.items.add(f))
      onFiles(dt.files)
    }
  }, [supportsPaste, onFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onFiles(e.target.files)
    // reset so the same file can be re-selected
    e.target.value = ''
  }, [onFiles])

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-secondary h-full gap-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onPaste={supportsPaste ? handlePaste : undefined}
      tabIndex={supportsPaste ? 0 : undefined}
    >
      <div
        onClick={() => inputRef.current?.click()}
        className={[
          'w-full max-w-xl p-12 border-2 border-dashed rounded-xl text-center transition-all cursor-pointer select-none',
          isDragging
            ? 'border-accent bg-accent/5 dark:bg-accent/10'
            : 'border-border hover:border-muted hover:bg-surface',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={[
            'p-4 rounded-full transition-colors',
            isDragging ? 'bg-accent/10 dark:bg-accent/20' : 'bg-default',
          ].join(' ')}>
            {isDragging
              ? <IconUpload className="w-10 h-10 text-accent" />
              : <span className="block w-10 h-10 flex items-center justify-center text-muted">{icon}</span>
            }
          </div>

          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              {isDragging ? dragTitle : title}
            </p>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert status="danger" className="w-full max-w-xl">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}
    </div>
  )
}
