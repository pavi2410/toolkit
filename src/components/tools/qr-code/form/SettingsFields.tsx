import { Label, ListBox, Select } from '@heroui/react'
import { ECC_LEVELS, type QrStyle } from '../types'
import { RangeField } from './fields'

const ECC_RECOVERY = { L: '7%', M: '15%', Q: '25%', H: '30%' } as const

interface SettingsFieldsProps {
  style: QrStyle
  onChange: (next: QrStyle) => void
}

export default function SettingsFields({ style, onChange }: SettingsFieldsProps) {
  return (
    <div className="space-y-4">
      <Select
        value={style.ecc}
        onChange={(key) => key && onChange({ ...style, ecc: key as QrStyle['ecc'] })}
        aria-label="Error correction"
        variant="secondary"
        className="w-full min-w-0"
      >
        <Label className="mb-1.5 text-xs font-medium text-foreground">Error correction</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {ECC_LEVELS.map((level) => (
              <ListBox.Item key={level} id={level}>
                {level} · {ECC_RECOVERY[level]}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <RangeField
        label="Quiet zone"
        value={style.border}
        display={`${style.border} modules`}
        min={1}
        max={8}
        step={1}
        onChange={(border) => onChange({ ...style, border })}
      />
      <RangeField
        label="Export size"
        value={style.size}
        display={`${style.size} px`}
        min={128}
        max={1024}
        step={32}
        onChange={(size) => onChange({ ...style, size })}
      />
    </div>
  )
}
