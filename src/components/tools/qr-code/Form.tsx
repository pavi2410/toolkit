import {
  InputGroup,
  Label,
  ListBox,
  Select,
  Slider,
  Switch,
  Tabs,
  TextField,
} from '@heroui/react'
import IconLink from '~icons/tabler/link'
import IconAlignLeft from '~icons/tabler/align-left'
import IconWifi from '~icons/tabler/wifi'
import IconMail from '~icons/tabler/mail'
import IconPhone from '~icons/tabler/phone'
import { ECC_LEVELS, WIFI_SECURITY, type ContentKind, type QrContent, type QrStyle } from './types'

const KINDS: { id: ContentKind; label: string; Icon: typeof IconLink }[] = [
  { id: 'url', label: 'URL', Icon: IconLink },
  { id: 'text', label: 'Text', Icon: IconAlignLeft },
  { id: 'wifi', label: 'Wi‑Fi', Icon: IconWifi },
  { id: 'email', label: 'Email', Icon: IconMail },
  { id: 'phone', label: 'Phone', Icon: IconPhone },
]

interface FormProps {
  content: QrContent
  style: QrStyle
  onContentChange: (next: QrContent) => void
  onStyleChange: (next: QrStyle) => void
}

export default function Form({ content, style, onContentChange, onStyleChange }: FormProps) {
  const setKind = (kind: ContentKind) => onContentChange({ ...content, kind })

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto p-4 lg:p-5">
      <Tabs
        selectedKey={content.kind}
        onSelectionChange={(key) => setKind(key as ContentKind)}
        variant="secondary"
        className="flex min-w-0 flex-col gap-4"
      >
        <Tabs.List aria-label="QR content type" className="flex w-full border-b border-border">
          {KINDS.map(({ id, label, Icon }) => (
            <Tabs.Tab
              key={id}
              id={id}
              className="flex flex-1 flex-col items-center gap-1 px-0 py-2 text-[11px] font-medium"
            >
              <Icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{label}</span>
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel id="url">
          <Field label="URL" value={content.url} onChange={(url) => onContentChange({ ...content, url })} placeholder="example.com or https://…" />
        </Tabs.Panel>
        <Tabs.Panel id="text">
          <Field
            label="Text"
            value={content.text}
            onChange={(text) => onContentChange({ ...content, text })}
            placeholder="Any text to encode"
            multiline
          />
        </Tabs.Panel>
        <Tabs.Panel id="wifi" className="space-y-3">
          <Field label="Network name" value={content.wifi.ssid} onChange={(ssid) => onContentChange({ ...content, wifi: { ...content.wifi, ssid } })} placeholder="SSID" />
          <Select
            value={content.wifi.security}
            onChange={(key) => key && onContentChange({ ...content, wifi: { ...content.wifi, security: key as typeof content.wifi.security } })}
            aria-label="Wi-Fi security"
            variant="secondary"
            className="w-full min-w-0"
          >
            <Label className="mb-1.5 text-xs font-medium text-foreground">Security</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {WIFI_SECURITY.map((item) => (
                  <ListBox.Item key={item} id={item}>
                    {item === 'nopass' ? 'None' : item}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          {content.wifi.security !== 'nopass' && (
            <Field
              label="Password"
              value={content.wifi.password}
              onChange={(password) => onContentChange({ ...content, wifi: { ...content.wifi, password } })}
              placeholder="Network password"
              type="password"
            />
          )}
          <Switch
            isSelected={content.wifi.hidden}
            onChange={(hidden) => onContentChange({ ...content, wifi: { ...content.wifi, hidden } })}
            size="sm"
          >
            <Switch.Content className="flex items-center gap-2">
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <span className="text-xs text-foreground">Hidden network</span>
            </Switch.Content>
          </Switch>
        </Tabs.Panel>
        <Tabs.Panel id="email" className="space-y-3">
          <Field label="To" value={content.email.to} onChange={(to) => onContentChange({ ...content, email: { ...content.email, to } })} placeholder="hello@example.com" type="email" />
          <Field label="Subject" value={content.email.subject} onChange={(subject) => onContentChange({ ...content, email: { ...content.email, subject } })} placeholder="Optional" />
          <Field
            label="Body"
            value={content.email.body}
            onChange={(body) => onContentChange({ ...content, email: { ...content.email, body } })}
            placeholder="Optional"
            multiline
          />
        </Tabs.Panel>
        <Tabs.Panel id="phone">
          <Field label="Phone" value={content.phone} onChange={(phone) => onContentChange({ ...content, phone })} placeholder="+1 555 555 0100" type="tel" />
        </Tabs.Panel>
      </Tabs>

      <div className="space-y-4 border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Style</p>

        <div className="grid min-w-0 grid-cols-1 gap-3">
          <ColorField label="Foreground" value={style.fg} onChange={(fg) => onStyleChange({ ...style, fg })} />
          <ColorField label="Background" value={style.bg} onChange={(bg) => onStyleChange({ ...style, bg })} />
        </div>

        <Select
          value={style.ecc}
          onChange={(key) => key && onStyleChange({ ...style, ecc: key as QrStyle['ecc'] })}
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
                  {level} · {level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Slider
          value={style.border}
          onChange={(value) => onStyleChange({ ...style, border: Array.isArray(value) ? value[0] : value })}
          minValue={1}
          maxValue={8}
          step={1}
          aria-label="Quiet zone"
          className="px-1"
        >
          <div className="mb-1 flex justify-between">
            <span className="text-xs font-medium text-foreground">Quiet zone</span>
            <span className="text-xs tabular-nums text-muted">{style.border} modules</span>
          </div>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>

        <Slider
          value={style.size}
          onChange={(value) => onStyleChange({ ...style, size: Array.isArray(value) ? value[0] : value })}
          minValue={128}
          maxValue={1024}
          step={32}
          aria-label="Export size"
          className="px-1"
        >
          <div className="mb-1 flex justify-between">
            <span className="text-xs font-medium text-foreground">Export size</span>
            <span className="text-xs tabular-nums text-muted">{style.size} px</span>
          </div>
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
      </div>
    </div>
  )
}

function Field({
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

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
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
