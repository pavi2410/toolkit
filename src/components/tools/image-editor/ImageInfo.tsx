import { useStore } from '@nanostores/react'
import { $originalMeta, $outputDimensions, $format, $quality, $estimatedFileSize } from '@/stores/image-editor'
import { Chip } from '@heroui/react'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ImageInfo() {
  const meta = useStore($originalMeta)
  const outputDims = useStore($outputDimensions)
  const format = useStore($format)
  const quality = useStore($quality)
  const estimatedSize = useStore($estimatedFileSize)

  if (!meta) return null

  return (
    <div className="shrink-0 border-t border-border bg-surface-secondary px-4 py-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-muted">Original</span>
          <Chip size="sm" variant="soft">{meta.width} × {meta.height}</Chip>
          <Chip size="sm" variant="soft">{meta.type.split('/')[1].toUpperCase()}</Chip>
          <Chip size="sm" variant="soft">{formatFileSize(meta.size)}</Chip>
        </div>

        {outputDims && (
          <div className="flex items-center gap-1.5">
            <span className="text-muted">Output</span>
            <Chip size="sm" variant="soft">{outputDims.width} × {outputDims.height}</Chip>
            <Chip size="sm" variant="soft">{format.toUpperCase()}</Chip>
            {format !== 'png' && <Chip size="sm" variant="soft">{Math.round(quality * 100)}%</Chip>}
            {estimatedSize && <Chip size="sm" variant="soft">~{formatFileSize(estimatedSize)}</Chip>}
          </div>
        )}
      </div>
    </div>
  )
}
