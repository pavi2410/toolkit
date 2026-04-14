import type { PdfFile } from './types'
import { Button, Chip } from '@heroui/react'
import IconFile from '~icons/tabler/file-type-pdf'
import IconLock from '~icons/tabler/lock'
import IconKey from '~icons/tabler/key'
import IconEye from '~icons/tabler/eye'

interface FileListProps {
  files: PdfFile[]
  onUnlock: (fileId: string) => void
  onBypass: (fileId: string) => void
  onPreview: (fileId: string) => void
}

export function FileList({ files, onUnlock, onBypass, onPreview }: FileListProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-foreground mb-2">
        Loaded Files ({files.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {files.map(file => (
          <div
            key={file.id}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-sm"
          >
            <IconFile className="w-4 h-4 text-danger" />
            <span className="text-foreground">{file.name}</span>
            <Chip size="sm" variant="soft">{file.pageCount} pages</Chip>

            {file.isLocked && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => onUnlock(file.id)}
                  className="gap-1 text-warning h-auto py-0.5 px-2 text-xs"
                  aria-label="Enter password to unlock"
                >
                  <IconLock className="w-3 h-3" />
                  Unlock
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => onBypass(file.id)}
                  className="gap-1 h-auto py-0.5 px-2 text-xs"
                  aria-label="Try to bypass restrictions"
                >
                  <IconKey className="w-3 h-3" />
                  Bypass
                </Button>
              </>
            )}

            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              onPress={() => onPreview(file.id)}
              aria-label="Preview"
              className="h-auto p-1"
            >
              <IconEye className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
