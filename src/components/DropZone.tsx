import { useRef, useState, useCallback, type ReactNode } from 'react'
import { Alert, Chip, Surface } from '@heroui/react'
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
      className="flex h-full flex-1 flex-col items-center justify-center gap-4 bg-surface-secondary p-4 sm:p-6"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onPaste={supportsPaste ? handlePaste : undefined}
      tabIndex={supportsPaste ? 0 : undefined}
    >
      <Surface className="w-full max-w-3xl rounded-[2rem] p-6 shadow-none sm:p-8">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-6 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            <Chip color="accent" variant="soft" size="sm">
              <Chip.Label>{multiple ? 'Multi-File Ready' : 'Single File Flow'}</Chip.Label>
            </Chip>
            {supportsPaste && (
              <Chip color="default" variant="soft" size="sm">
                <Chip.Label>Paste Supported</Chip.Label>
              </Chip>
            )}
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={[
              'flex w-full flex-col items-center gap-4 rounded-[calc(var(--radius)*2)] border border-dashed px-6 py-10 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
              isDragging
                ? 'border-accent bg-accent/6'
                : 'border-border bg-surface-secondary hover:bg-surface',
            ].join(' ')}
          >
            <div className={[
              'flex h-16 w-16 items-center justify-center rounded-full transition-colors',
              isDragging ? 'bg-accent/12 text-accent' : 'bg-default text-muted',
            ].join(' ')}>
              {isDragging
                ? <IconUpload className="h-8 w-8" />
                : <span className="flex h-8 w-8 items-center justify-center">{icon}</span>
              }
            </div>

            <div className="space-y-2">
              <p className="text-xl font-semibold text-foreground">
                {isDragging ? dragTitle : title}
              </p>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-muted">{subtitle}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Chip color="accent" variant="soft">
                <Chip.Label>Choose Files</Chip.Label>
              </Chip>
              <Chip color="default" variant="soft">
                <Chip.Label>Drag & Drop</Chip.Label>
              </Chip>
            </div>
          </button>
        </div>
      </Surface>

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
