import { useStore } from '@nanostores/react'
import {
  $canUndo,
  $canRedo,
  $hasChanges,
  $zoom,
  $zoomMode,
  $isComparing,
  $originalMeta,
  ZOOM_PRESETS,
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
export default function Toolbar() {
  const canUndo = useStore($canUndo)
  const canRedo = useStore($canRedo)
  const hasChanges = useStore($hasChanges)
  const zoom = useStore($zoom)
  const zoomMode = useStore($zoomMode)
  const zoomKey = zoomMode === 'manual'
    ? ZOOM_PRESETS.includes(zoom) ? String(zoom) : null
    : zoomMode
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
          <Button isIconOnly size="sm" variant="tertiary" onPress={actions.zoomOut} aria-label="Zoom out">
            <IconZoomOut className="w-4 h-4" />
          </Button>

          <Select
            value={zoomKey}
            placeholder={`${Math.round(zoom * 100)}%`}
            onChange={k => {
              if (k === 'fit' || k === 'fill') actions.setZoomMode(k)
              else if (k) actions.setZoom(parseFloat(k as string))
            }}
            aria-label="Zoom level"
            variant="secondary"
            className="w-28"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="fit" textValue="Fit">Fit</ListBox.Item>
                <ListBox.Item id="fill" textValue="Fill">Fill</ListBox.Item>
                {ZOOM_PRESETS.map(z => (
                  <ListBox.Item key={z} id={String(z)}>{Math.round(z * 100)}%</ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Button isIconOnly size="sm" variant="tertiary" onPress={actions.zoomIn} aria-label="Zoom in">
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
