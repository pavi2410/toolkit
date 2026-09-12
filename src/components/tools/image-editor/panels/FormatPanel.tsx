import { useState, useCallback } from 'react'
import { useStore } from '@nanostores/react'
import {
  $originalImage, $originalMeta, $transforms, $format, $quality,
  $targetFileSize, $outputDimensions, actions, type ImageFormat,
} from '@/stores/image-editor'
import { Alert, Button, ButtonGroup, NumberField, Slider } from '@heroui/react'
import IconDownload from '~icons/tabler/download'
import IconClipboard from '~icons/tabler/clipboard'
import IconCheck from '~icons/tabler/check'

const FORMATS: { id: ImageFormat; label: string; lossy: boolean }[] = [
  { id: 'png', label: 'PNG', lossy: false },
  { id: 'jpeg', label: 'JPEG', lossy: true },
  { id: 'webp', label: 'WebP', lossy: true },
]

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function FormatPanel() {
  const originalImage = useStore($originalImage)
  const meta = useStore($originalMeta)
  const transforms = useStore($transforms)
  const format = useStore($format)
  const quality = useStore($quality)
  const targetFileSize = useStore($targetFileSize)
  const outputDims = useStore($outputDimensions)

  const [isExporting, setIsExporting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  const selectedFormat = FORMATS.find(f => f.id === format)!

  const renderToBlob = useCallback(async (q: number = quality): Promise<Blob | null> => {
    if (!originalImage || !outputDims) return null
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    let { width, height } = outputDims
    const isRotated = transforms.rotation === 90 || transforms.rotation === 270
    canvas.width = isRotated ? height : width
    canvas.height = isRotated ? width : height

    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((transforms.rotation * Math.PI) / 180)
    ctx.scale(transforms.flipH ? -1 : 1, transforms.flipV ? -1 : 1)

    const filters = [
      transforms.brightness !== 0 && `brightness(${1 + transforms.brightness / 100})`,
      transforms.contrast !== 0 && `contrast(${1 + transforms.contrast / 100})`,
      transforms.saturation !== 0 && `saturate(${1 + transforms.saturation / 100})`,
    ].filter(Boolean)
    if (filters.length) ctx.filter = filters.join(' ')

    const sourceX = transforms.crop ? transforms.crop.x * originalImage.width : 0
    const sourceY = transforms.crop ? transforms.crop.y * originalImage.height : 0
    const sourceW = transforms.crop ? transforms.crop.width * originalImage.width : originalImage.width
    const sourceH = transforms.crop ? transforms.crop.height * originalImage.height : originalImage.height
    ctx.drawImage(originalImage, sourceX, sourceY, sourceW, sourceH, -width / 2, -height / 2, width, height)
    ctx.restore()

    return new Promise(resolve => canvas.toBlob(blob => resolve(blob), `image/${format}`, selectedFormat.lossy ? q : undefined))
  }, [originalImage, outputDims, transforms, format, quality, selectedFormat.lossy])

  const updateEstimatedSize = useCallback(async () => {
    const blob = await renderToBlob()
    if (blob) setEstimatedSize(blob.size)
  }, [renderToBlob])

  const handleExport = async () => {
    setIsExporting(true)
    setExportError(null)
    try {
      let blob: Blob | null = null
      if (targetFileSize) {
        let low = 0.1, high = 1.0, bestBlob: Blob | null = null
        for (let i = 0; i < 8; i++) {
          if (high - low < 0.01) break
          const mid = (low + high) / 2
          blob = await renderToBlob(mid)
          if (!blob) break
          if (blob.size <= targetFileSize) { bestBlob = blob; low = mid } else { high = mid }
        }
        blob = bestBlob
      } else {
        blob = await renderToBlob()
      }
      if (!blob) { setExportError('Failed to export image. Try a different format or smaller dimensions.'); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${meta?.name.replace(/\.[^.]+$/, '') ?? 'image'}-edited.${format === 'jpeg' ? 'jpg' : format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopy = async () => {
    setIsCopying(true)
    setCopySuccess(false)
    try {
      const blob = await renderToBlob()
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (e) {
      setExportError('Failed to copy image to clipboard.')
      console.error('Failed to copy:', e)
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Format</label>
        <ButtonGroup variant="secondary" className="w-full">
          {FORMATS.map(f => (
            <Button
              key={f.id}
              variant={format === f.id ? 'primary' : 'secondary'}
              onPress={() => { actions.setFormat(f.id); updateEstimatedSize() }}
              className="flex-1"
            >
              {f.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {selectedFormat.lossy && (
        <Slider
          value={Math.round(quality * 100)}
          onChange={(v) => {
            const next = Array.isArray(v) ? v[0] : v
            actions.setQuality(next / 100)
            updateEstimatedSize()
          }}
          minValue={10}
          maxValue={100}
        >
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-foreground">Quality</span>
            <Slider.Output className="text-xs text-muted tabular-nums" />
          </div>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
      )}

      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Target File Size (optional)</label>
        <NumberField
          value={targetFileSize ? Math.round(targetFileSize / 1024) : undefined}
          onChange={kb => actions.setTargetSize(isNaN(kb) || kb <= 0 ? null : kb * 1024)}
          minValue={1}
          aria-label="Target file size in KB"
          variant="secondary"
          fullWidth
        >
          <NumberField.Group>
            <NumberField.Input placeholder="e.g. 500" />
          </NumberField.Group>
        </NumberField>
        {targetFileSize && (
          <p className="text-xs text-muted mt-1">Quality will be auto-adjusted to meet target</p>
        )}
      </div>

      {estimatedSize && (
        <div className="px-3 py-2 bg-default rounded-lg text-xs text-muted">
          Estimated: <span className="font-medium text-foreground">{formatFileSize(estimatedSize)}</span>
        </div>
      )}

      {exportError && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{exportError}</Alert.Description>
          </Alert.Content>
          <button
            type="button"
            onClick={() => setExportError(null)}
            className="ml-auto text-xs text-muted hover:text-foreground"
            aria-label="Dismiss"
          >
            Dismiss
          </button>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          variant="primary"
          onPress={handleExport}
          isPending={isExporting}
          className="flex-1 gap-2"
        >
          <IconDownload className="w-4 h-4" />
          {isExporting ? 'Saving…' : 'Download'}
        </Button>
        <Button
          variant={copySuccess ? 'primary' : 'secondary'}
          isIconOnly
          onPress={handleCopy}
          isPending={isCopying}
          aria-label="Copy to clipboard"
        >
          {copySuccess ? <IconCheck className="w-4 h-4" /> : <IconClipboard className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
