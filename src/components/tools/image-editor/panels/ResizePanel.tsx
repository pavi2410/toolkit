import { useState, useEffect } from 'react'
import { useStore } from '@nanostores/react'
import { $croppedDimensions, $transforms, actions } from '@/stores/image-editor'
import { Button, NumberField, Slider } from '@heroui/react'
import IconLink from '~icons/tabler/link'
import IconLinkOff from '~icons/tabler/link-off'

const PRESETS = [
  { label: '1080p', width: 1920, height: 1080 },
  { label: '720p', width: 1280, height: 720 },
  { label: '4K', width: 3840, height: 2160 },
  { label: 'Instagram', width: 1080, height: 1080 },
  { label: 'Twitter', width: 1200, height: 675 },
  { label: 'Facebook', width: 1200, height: 630 },
]

export default function ResizePanel() {
  const croppedDims = useStore($croppedDimensions)
  const transforms = useStore($transforms)

  const baseWidth = croppedDims?.width ?? 0
  const baseHeight = croppedDims?.height ?? 0
  const currentWidth = transforms.resize?.width ?? baseWidth
  const currentHeight = transforms.resize?.height ?? baseHeight
  const aspectRatio = baseWidth && baseHeight ? baseWidth / baseHeight : 1

  const [width, setWidth] = useState(currentWidth)
  const [height, setHeight] = useState(currentHeight)
  const [lockAspect, setLockAspect] = useState(true)
  const [percentage, setPercentage] = useState(100)

  useEffect(() => {
    setWidth(currentWidth)
    setHeight(currentHeight)
    if (baseWidth) setPercentage(Math.round((currentWidth / baseWidth) * 100))
  }, [currentWidth, currentHeight, baseWidth])

  const handleWidthChange = (w: number) => {
    if (isNaN(w) || w <= 0) return
    setWidth(w)
    if (lockAspect) setHeight(Math.round(w / aspectRatio))
    if (baseWidth) setPercentage(Math.round((w / baseWidth) * 100))
  }

  const handleHeightChange = (h: number) => {
    if (isNaN(h) || h <= 0) return
    setHeight(h)
    if (lockAspect) {
      const newWidth = Math.round(h * aspectRatio)
      setWidth(newWidth)
      if (baseWidth) setPercentage(Math.round((newWidth / baseWidth) * 100))
    } else {
      if (baseHeight) setPercentage(Math.round((h / baseHeight) * 100))
    }
  }

  const handlePercentageChange = (pct: number) => {
    if (isNaN(pct) || pct <= 0 || !baseWidth || !baseHeight) return
    setPercentage(pct)
    setWidth(Math.round(baseWidth * (pct / 100)))
    setHeight(Math.round(baseHeight * (pct / 100)))
  }

  const applyResize = () => {
    if (width > 0 && height > 0) actions.setResize(width, height)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Dimensions (px)</label>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <NumberField value={width} onChange={handleWidthChange} onBlur={applyResize} minValue={1} aria-label="Width" variant="secondary">
            <span className="block text-[10px] text-muted mb-1">Width</span>
            <NumberField.Group>
              <NumberField.Input onKeyDown={e => e.key === 'Enter' && applyResize()} />
            </NumberField.Group>
          </NumberField>

          <Button isIconOnly size="sm" variant={lockAspect ? 'secondary' : 'tertiary'} onPress={() => setLockAspect(!lockAspect)} aria-label={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}>
            {lockAspect ? <IconLink className="w-4 h-4" /> : <IconLinkOff className="w-4 h-4" />}
          </Button>

          <NumberField value={height} onChange={handleHeightChange} onBlur={applyResize} minValue={1} aria-label="Height" variant="secondary">
            <span className="block text-[10px] text-muted mb-1">Height</span>
            <NumberField.Group>
              <NumberField.Input onKeyDown={e => e.key === 'Enter' && applyResize()} />
            </NumberField.Group>
          </NumberField>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Scale</label>
        <Slider
          value={percentage}
          onChange={(value) => handlePercentageChange(Array.isArray(value) ? value[0] : value)}
          onChangeEnd={applyResize}
          minValue={10}
          maxValue={200}
        >
          <Slider.Output className="block text-xs text-muted tabular-nums mb-1" />
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map(preset => (
            <Button key={preset.label} variant="secondary" size="sm" onPress={() => { setWidth(preset.width); setHeight(preset.height); actions.setResize(preset.width, preset.height) }} className="flex flex-col h-auto py-2">
              <span>{preset.label}</span>
              <span className="text-[10px] opacity-60">{preset.width}×{preset.height}</span>
            </Button>
          ))}
        </div>
      </div>

      {transforms.resize && (
        <Button variant="ghost" size="sm" onPress={actions.clearResize} className="w-full text-danger">
          Reset to original size
        </Button>
      )}
    </div>
  )
}
