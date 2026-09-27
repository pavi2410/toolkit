import { Button, Tooltip } from '@heroui/react'
import IconArrowsExchange from '~icons/tabler/arrows-exchange'
import type { QrStyle } from '../types'
import { ColorField } from './fields'

interface StyleFieldsProps {
  style: QrStyle
  onChange: (next: QrStyle) => void
}

export default function StyleFields({ style, onChange }: StyleFieldsProps) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2">
      <ColorField label="Foreground" value={style.fg} onChange={(fg) => onChange({ ...style, fg })} />
      <Tooltip delay={300}>
        <Button
          isIconOnly
          size="sm"
          variant="tertiary"
          aria-label="Invert colors"
          onPress={() => onChange({ ...style, fg: style.bg, bg: style.fg })}
          className="mb-1"
        >
          <IconArrowsExchange className="h-4 w-4" />
        </Button>
        <Tooltip.Content>Invert colors</Tooltip.Content>
      </Tooltip>
      <ColorField label="Background" value={style.bg} onChange={(bg) => onChange({ ...style, bg })} />
    </div>
  )
}
