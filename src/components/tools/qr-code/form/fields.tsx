import { InputGroup, Label, Slider, TextField } from '@heroui/react'

export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  type?: 'text' | 'password' | 'email' | 'tel'
}) {
  return (
    <TextField value={value} onChange={onChange} className="w-full min-w-0" variant="secondary">
      <Label className="mb-1.5 text-xs font-medium text-foreground">{label}</Label>
      <InputGroup fullWidth variant="secondary" className="min-w-0">
        {multiline ? (
          <InputGroup.TextArea rows={6} placeholder={placeholder} className="min-h-32 min-w-0 resize-y" />
        ) : (
          <InputGroup.Input type={type} placeholder={placeholder} className="min-w-0" />
        )}
      </InputGroup>
    </TextField>
  )
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <TextField value={value} onChange={onChange} className="w-full min-w-0" variant="secondary">
      <Label className="mb-1.5 text-xs font-medium text-foreground">{label}</Label>
      <InputGroup fullWidth variant="secondary" className="min-w-0">
        <InputGroup.Prefix>
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'}
            onChange={(event) => onChange(event.target.value)}
            aria-label={label}
            className="h-6 w-6 shrink-0 cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0"
          />
        </InputGroup.Prefix>
        <InputGroup.Input className="min-w-0 font-mono uppercase" maxLength={7} />
      </InputGroup>
    </TextField>
  )
}

export function RangeField({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <Slider
      value={value}
      onChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
      minValue={min}
      maxValue={max}
      step={step}
      aria-label={label}
      className="px-1"
    >
      <div className="mb-1 flex justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs tabular-nums text-muted">{display}</span>
      </div>
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  )
}
