import { Button, Separator } from '@heroui/react'
import IconPlus from '~icons/tabler/plus'
import IconTrash from '~icons/tabler/trash'
import IconDownload from '~icons/tabler/download'
import IconScissors from '~icons/tabler/scissors'
import IconPhoto from '~icons/tabler/photo'

interface ToolbarProps {
  pagesCount: number
  selectedCount: number
  isProcessing: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectAll: () => void
  onDeleteSelected: () => void
  onExtractSelected: () => void
  onExportImages: () => void
  onExportSelectedImages?: () => void
  onClearAll: () => void
  onExport: () => void
}

export function Toolbar({
  pagesCount,
  selectedCount,
  isProcessing,
  inputRef,
  onInputChange,
  onSelectAll,
  onDeleteSelected,
  onExtractSelected,
  onExportImages,
  onExportSelectedImages,
  onClearAll,
  onExport,
}: ToolbarProps) {
  return (
    <div className="shrink-0 bg-surface border-b border-border px-4 py-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onPress={() => inputRef.current?.click()} className="gap-2">
            <IconPlus className="w-4 h-4" />
            Add PDFs
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={onInputChange}
            className="hidden"
          />

          <Separator orientation="vertical" className="h-6" />

          <Button variant="tertiary" size="sm" onPress={onSelectAll}>
            {selectedCount === pagesCount ? 'Deselect All' : 'Select All'}
          </Button>

          {selectedCount > 0 && (
            <>
              <Button variant="ghost" size="sm" onPress={onDeleteSelected} className="gap-1.5 text-danger">
                <IconTrash className="w-4 h-4" />
                Delete ({selectedCount})
              </Button>

              <Button variant="ghost" size="sm" onPress={onExtractSelected} className="gap-1.5 text-accent">
                <IconScissors className="w-4 h-4" />
                Extract Selected
              </Button>

              {onExportSelectedImages && (
                <Button variant="ghost" size="sm" onPress={onExportSelectedImages} className="gap-1.5">
                  <IconPhoto className="w-4 h-4" />
                  Export as Images
                </Button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={onExportImages}
            isDisabled={isProcessing || pagesCount === 0}
            className="gap-2"
          >
            <IconPhoto className="w-4 h-4" />
            Export as Images
          </Button>

          <Button variant="tertiary" size="sm" onPress={onClearAll}>
            Clear All
          </Button>

          <Button
            variant="primary"
            size="sm"
            onPress={onExport}
            isDisabled={isProcessing || pagesCount === 0}
            isPending={isProcessing}
            className="gap-2"
          >
            <IconDownload className="w-4 h-4" />
            {isProcessing ? 'Processing…' : 'Download PDF'}
          </Button>
        </div>
      </div>
    </div>
  )
}
