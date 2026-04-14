import { useState } from 'react'
import { useStore } from '@nanostores/react'
import { $originalMeta, $transforms, $isCropping, $cropSelection, actions } from '@/stores/image-editor'
import { Button, NumberField } from '@heroui/react'

const ASPECT_PRESETS = [
  { label: 'Free', ratio: null },
  { label: '1:1', ratio: 1 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:2', ratio: 3 / 2 },
  { label: '9:16', ratio: 9 / 16 },
  { label: '3:4', ratio: 3 / 4 },
  { label: '2:3', ratio: 2 / 3 },
]

export default function CropPanel() {
  const meta = useStore($originalMeta)
  const transforms = useStore($transforms)
  const isCropping = useStore($isCropping)
  const cropSelection = useStore($cropSelection)
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null)

  if (!meta) return null

  const cropX = parseFloat((cropSelection.x * 100).toFixed(1))
  const cropY = parseFloat((cropSelection.y * 100).toFixed(1))
  const cropW = parseFloat((cropSelection.width * 100).toFixed(1))
  const cropH = parseFloat((cropSelection.height * 100).toFixed(1))

  const updateCropSelection = (field: 'x' | 'y' | 'width' | 'height', value: number) => {
    if (isNaN(value)) return
    $cropSelection.set({ ...cropSelection, [field]: Math.max(0, Math.min(1, value / 100)) })
  }

  const handlePresetClick = (ratio: number | null) => {
    setSelectedRatio(ratio)
    if (ratio === null) { $cropSelection.set({ x: 0, y: 0, width: 1, height: 1 }); return }
    const imageRatio = meta.width / meta.height
    const cropWidth = ratio > imageRatio ? 1 : ratio / imageRatio
    const cropHeight = ratio > imageRatio ? imageRatio / ratio : 1
    $cropSelection.set({ x: (1 - cropWidth) / 2, y: (1 - cropHeight) / 2, width: cropWidth, height: cropHeight })
  }

  const applyCrop = () => {
    const { x, y, width, height } = cropSelection
    if (x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > 1.001 || y + height > 1.001) return
    actions.setCrop({ x, y, width, height })
    actions.setIsCropping(false)
  }

  const startCropping = () => {
    actions.setIsCropping(true)
    $cropSelection.set(transforms.crop ?? { x: 0, y: 0, width: 1, height: 1 })
  }

  const cancelCrop = () => {
    actions.setIsCropping(false)
    $cropSelection.set({ x: 0, y: 0, width: 1, height: 1 })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Aspect Ratio</label>
        <div className="grid grid-cols-4 gap-1">
          {ASPECT_PRESETS.map(preset => (
            <Button
              key={preset.label}
              size="sm"
              variant={selectedRatio === preset.ratio ? 'primary' : 'secondary'}
              onPress={() => handlePresetClick(preset.ratio)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Crop Region (%)</label>
        <div className="grid grid-cols-2 gap-2">
          {([['X', cropX, 'x'], ['Y', cropY, 'y'], ['Width', cropW, 'width'], ['Height', cropH, 'height']] as const).map(([label, val, field]) => (
            <NumberField key={field} value={val} onChange={v => updateCropSelection(field, v)} minValue={0} maxValue={100} step={0.1} aria-label={label} variant="secondary">
              <span className="block text-[10px] text-muted mb-1">{label}</span>
              <NumberField.Group>
                <NumberField.Input />
              </NumberField.Group>
            </NumberField>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {!isCropping ? (
          <Button variant="primary" onPress={startCropping} className="flex-1">
            {transforms.crop ? 'Edit Crop' : 'Start Crop'}
          </Button>
        ) : (
          <>
            <Button variant="primary" onPress={applyCrop} className="flex-1">Apply</Button>
            <Button variant="secondary" onPress={cancelCrop} className="flex-1">Cancel</Button>
          </>
        )}
      </div>

      {transforms.crop && !isCropping && (
        <Button variant="ghost" size="sm" onPress={actions.clearCrop} className="w-full text-danger">
          Remove crop
        </Button>
      )}
    </div>
  )
}
