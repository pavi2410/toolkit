import { Button, Separator, Toolbar as HuiToolbar } from '@heroui/react'
import { ToolPageToolbar } from '#/components/ToolPageToolbar'
import IconDownload from '~icons/tabler/download'
import IconCopy from '~icons/tabler/copy'
import IconCheck from '~icons/tabler/check'
import IconSparkles from '~icons/tabler/sparkles'
import IconSwitchHorizontal from '~icons/tabler/switch-horizontal'

interface ToolbarProps {
  canExport: boolean
  copyState: 'idle' | 'copied' | 'failed'
  onLoadExample: () => void
  onInvert: () => void
  onCopy: () => void
  onDownloadPng: () => void
  onDownloadSvg: () => void
}

export default function Toolbar({
  canExport,
  copyState,
  onLoadExample,
  onInvert,
  onCopy,
  onDownloadPng,
  onDownloadSvg,
}: ToolbarProps) {
  return (
    <ToolPageToolbar>
      <HuiToolbar aria-label="QR code options" className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="tertiary" onPress={onLoadExample}>
            <IconSparkles className="h-4 w-4" />
            Load Example
          </Button>
          <Button size="sm" variant="tertiary" onPress={onInvert} isDisabled={!canExport}>
            <IconSwitchHorizontal className="h-4 w-4" />
            Invert
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="tertiary" onPress={onCopy} isDisabled={!canExport}>
            {copyState === 'copied' ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
            {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy PNG'}
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <Button size="sm" variant="secondary" onPress={onDownloadSvg} isDisabled={!canExport}>
            SVG
          </Button>
          <Button size="sm" variant="primary" onPress={onDownloadPng} isDisabled={!canExport}>
            <IconDownload className="h-4 w-4" />
            PNG
          </Button>
        </div>
      </HuiToolbar>
    </ToolPageToolbar>
  )
}
