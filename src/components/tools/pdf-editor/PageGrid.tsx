import type { PageInfo } from './types'
import { Button } from '@heroui/react'
import IconFile from '~icons/tabler/file-type-pdf'
import IconTrash from '~icons/tabler/trash'
import IconRotateClockwise from '~icons/tabler/rotate-clockwise'
import IconRotate2 from '~icons/tabler/rotate-2'
import IconGripVertical from '~icons/tabler/grip-vertical'

interface PageGridProps {
  pages: PageInfo[]
  selectedPages: Set<string>
  draggedPage: string | null
  filesCount: number
  getFileName: (fileId: string) => string
  onToggleSelection: (pageId: string) => void
  onRotate: (pageId: string, degrees: number) => void
  onDelete: (pageId: string) => void
  onDragStart: (e: React.DragEvent, pageId: string) => void
  onDragOver: (e: React.DragEvent, pageId: string) => void
  onDragEnd: () => void
}

export function PageGrid({
  pages,
  selectedPages,
  draggedPage,
  filesCount,
  getFileName,
  onToggleSelection,
  onRotate,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
}: PageGridProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground mb-2">
        Pages ({pages.length}) — Drag to reorder
      </h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4 xl:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
        {pages.map((page, index) => (
          <div
            key={page.id}
            role="button"
            tabIndex={0}
            aria-label={`Page ${index + 1}${selectedPages.has(page.id) ? ', selected' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, page.id)}
            onDragOver={(e) => onDragOver(e, page.id)}
            onDragEnd={onDragEnd}
            onClick={() => onToggleSelection(page.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggleSelection(page.id)
              }
            }}
            className={`
              group relative bg-surface border-2 rounded-lg overflow-hidden cursor-pointer transition-all
              ${selectedPages.has(page.id)
                ? 'border-accent ring-2 ring-accent-soft-hover'
                : 'border-border hover:border-muted'
              }
              ${draggedPage === page.id ? 'opacity-50' : ''}
            `}
          >
            {/* Drag handle */}
            <div className="absolute top-1 left-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <IconGripVertical className="w-4 h-4 text-muted" />
            </div>

            {/* Badges container - top right */}
            <div className="absolute top-1 right-1 z-10 flex flex-col items-end gap-0.5">
              <div className="px-1.5 py-0.5 bg-foreground/70 text-background text-xs font-medium rounded">
                {index + 1}
              </div>
              <div className="px-1.5 py-0.5 bg-accent/85 text-accent-foreground text-[10px] font-medium rounded" title={`Original: ${getFileName(page.fileId)} - Page ${page.pageIndex + 1}`}>
                {filesCount > 1 ? `${getFileName(page.fileId).slice(0, 6)}:${page.pageIndex + 1}` : `orig: ${page.pageIndex + 1}`}
              </div>
            </div>

            {/* Page preview */}
            <div className="aspect-8.5/11 bg-default flex items-center justify-center overflow-hidden">
              {page.thumbnailUrl ? (
                <img
                  src={page.thumbnailUrl}
                  alt={`Page ${page.pageIndex + 1}`}
                  className="w-full h-full object-contain"
                  style={{ transform: `rotate(${page.rotation}deg)` }}
                />
              ) : (
                <div className="text-center p-2" style={{ transform: `rotate(${page.rotation}deg)` }}>
                  <IconFile className="w-8 h-8 text-muted mx-auto mb-1" />
                  <p className="text-xs text-muted truncate max-w-full px-1">
                    {getFileName(page.fileId)}
                  </p>
                  <p className="text-xs text-muted">
                    Page {page.pageIndex + 1}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-center gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="secondary"
                  onPress={() => { onRotate(page.id, -90) }}
                  aria-label="Rotate left"
                  className="p-1 h-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconRotate2 className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="secondary"
                  onPress={() => onRotate(page.id, 90)}
                  aria-label="Rotate right"
                  className="p-1 h-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconRotateClockwise className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="secondary"
                  onPress={() => onDelete(page.id)}
                  aria-label="Delete page"
                  className="p-1 h-auto text-danger"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconTrash className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selection checkbox */}
            <div className={`
              absolute top-1 left-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
              ${selectedPages.has(page.id)
                ? 'bg-accent border-accent'
                : 'bg-surface/80 border-border opacity-0 group-hover:opacity-100'
              }
            `}>
              {selectedPages.has(page.id) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
