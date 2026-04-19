import { useStore } from '@nanostores/react'
import {
  $canUndo,
  $canRedo,
  $hasChanges,
  $zoom,
  $isComparing,
  $originalMeta,
  actions,
} from '@/stores/image-editor'
import { Button, ButtonGroup, Separator, Select, ListBox, Toolbar as HuiToolbar } from '@heroui/react'
import { ToolPageToolbar } from '#/components/ToolPageToolbar'
import IconArrowBackUp from '~icons/tabler/arrow-back-up'
import IconArrowForwardUp from '~icons/tabler/arrow-forward-up'
import IconRefresh from '~icons/tabler/refresh'
import IconZoomIn from '~icons/tabler/zoom-in'
import IconZoomOut from '~icons/tabler/zoom-out'
import IconEye from '~icons/tabler/eye'
import IconX from '~icons/tabler/x'

const ZOOM_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3]

export default function Toolbar() {
  const canUndo = useStore($canUndo)
  const canRedo = useStore($canRedo)
  const hasChanges = useStore($hasChanges)
  const zoom = useStore($zoom)
  const isComparing = useStore($isComparing)
  const meta = useStore($originalMeta)

  const displayName = meta?.name
    ? meta.name.length > 24 ? meta.name.slice(0, 21) + '...' : meta.name
    : 'Image'

  return (
    <ToolPageToolbar>
      <HuiToolbar aria-label="Image editor options" className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground max-w-[50ch] truncate" title={meta?.name}>
            {displayName}
          </span>
          <Separator orientation="vertical" className="h-5" />
          <ButtonGroup variant="tertiary">
            <Button isIconOnly size="sm" isDisabled={!canUndo} onPress={actions.undo} aria-label="Undo">
              <IconArrowBackUp className="w-4 h-4" />
            </Button>
            <Button isIconOnly size="sm" isDisabled={!canRedo} onPress={actions.redo} aria-label="Redo">
              <IconArrowForwardUp className="w-4 h-4" />
            </Button>
          </ButtonGroup>
          <Separator orientation="vertical" className="h-5" />
          <Button isIconOnly size="sm" variant="tertiary" isDisabled={!hasChanges} onPress={actions.reset} aria-label="Reset">
            <IconRefresh className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button isIconOnly size="sm" variant="tertiary" onPress={() => actions.setZoom(Math.max(0.1, zoom - 0.25))} aria-label="Zoom out">
            <IconZoomOut className="w-4 h-4" />
          </Button>

          <Select
            value={String(zoom)}
            onChange={k => k && actions.setZoom(parseFloat(k as string))}
            aria-label="Zoom level"
            variant="secondary"
            className="w-24"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="1">Fit</ListBox.Item>
                {ZOOM_OPTIONS.map(z => (
                  <ListBox.Item key={z} id={String(z)}>{Math.round(z * 100)}%</ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Button isIconOnly size="sm" variant="tertiary" onPress={() => actions.setZoom(Math.min(3, zoom + 0.25))} aria-label="Zoom in">
            <IconZoomIn className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-5" />

          <Button
            isIconOnly size="sm"
            variant={isComparing ? 'primary' : 'tertiary'}
            onPress={actions.toggleCompare}
            aria-label="Compare with original"
          >
            <IconEye className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-5" />

          <Button isIconOnly size="sm" variant="tertiary" onPress={actions.clearImage} aria-label="Close image">
            <IconX className="w-4 h-4" />
          </Button>
        </div>
      </HuiToolbar>
    </ToolPageToolbar>
  )
}
