import { Label, ListBox, Select, Switch, Tag, TagGroup } from '@heroui/react'
import IconLink from '~icons/tabler/link'
import IconAlignLeft from '~icons/tabler/align-left'
import IconWifi from '~icons/tabler/wifi'
import IconMail from '~icons/tabler/mail'
import IconPhone from '~icons/tabler/phone'
import { WIFI_SECURITY, type ContentKind, type QrContent } from '../types'
import { Field } from './fields'

const KINDS: { id: ContentKind; label: string; Icon: typeof IconLink }[] = [
  { id: 'url', label: 'URL', Icon: IconLink },
  { id: 'text', label: 'Text', Icon: IconAlignLeft },
  { id: 'wifi', label: 'Wi‑Fi', Icon: IconWifi },
  { id: 'email', label: 'Email', Icon: IconMail },
  { id: 'phone', label: 'Phone', Icon: IconPhone },
]

interface ContentFieldsProps {
  content: QrContent
  onChange: (next: QrContent) => void
}

export default function ContentFields({ content, onChange }: ContentFieldsProps) {
  return (
    <div className="space-y-4">
      <TagGroup
        aria-label="QR content type"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[content.kind]}
        onSelectionChange={(keys) => {
          const [kind] = keys
          if (kind) onChange({ ...content, kind: kind as ContentKind })
        }}
      >
        <TagGroup.List className="flex flex-wrap gap-1.5">
          {KINDS.map(({ id, label, Icon }) => (
            <Tag key={id} id={id} textValue={label} className="gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Tag>
          ))}
        </TagGroup.List>
      </TagGroup>

      <KindFields content={content} onChange={onChange} />
    </div>
  )
}

function KindFields({ content, onChange }: ContentFieldsProps) {
  const { wifi, email } = content

  switch (content.kind) {
    case 'url':
      return <Field label="URL" value={content.url} onChange={(url) => onChange({ ...content, url })} placeholder="example.com or https://…" />
    case 'text':
      return <Field label="Text" value={content.text} onChange={(text) => onChange({ ...content, text })} placeholder="Any text to encode" multiline />
    case 'phone':
      return <Field label="Phone" value={content.phone} onChange={(phone) => onChange({ ...content, phone })} placeholder="+1 555 555 0100" type="tel" />
    case 'email':
      return (
        <div className="space-y-3">
          <Field label="To" value={email.to} onChange={(to) => onChange({ ...content, email: { ...email, to } })} placeholder="hello@example.com" type="email" />
          <Field label="Subject" value={email.subject} onChange={(subject) => onChange({ ...content, email: { ...email, subject } })} placeholder="Optional" />
          <Field label="Body" value={email.body} onChange={(body) => onChange({ ...content, email: { ...email, body } })} placeholder="Optional" multiline />
        </div>
      )
    case 'wifi':
      return (
        <div className="space-y-3">
          <Field label="Network name" value={wifi.ssid} onChange={(ssid) => onChange({ ...content, wifi: { ...wifi, ssid } })} placeholder="SSID" />
          <Select
            value={wifi.security}
            onChange={(key) => key && onChange({ ...content, wifi: { ...wifi, security: key as typeof wifi.security } })}
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
          {wifi.security !== 'nopass' && (
            <Field
              label="Password"
              value={wifi.password}
              onChange={(password) => onChange({ ...content, wifi: { ...wifi, password } })}
              placeholder="Network password"
              type="password"
            />
          )}
          <Switch isSelected={wifi.hidden} onChange={(hidden) => onChange({ ...content, wifi: { ...wifi, hidden } })} size="sm">
            <Switch.Content className="flex items-center gap-2">
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <span className="text-xs text-foreground">Hidden network</span>
            </Switch.Content>
          </Switch>
        </div>
      )
  }
}
