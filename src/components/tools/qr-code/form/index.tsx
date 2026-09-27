import type { ComponentType, ReactNode, SVGProps } from 'react'
import { Accordion } from '@heroui/react'
import IconForms from '~icons/tabler/forms'
import IconPalette from '~icons/tabler/palette'
import IconSettings from '~icons/tabler/settings'
import type { QrContent, QrStyle } from '../types'
import ContentFields from './ContentFields'
import SettingsFields from './SettingsFields'
import StyleFields from './StyleFields'

interface FormProps {
  content: QrContent
  style: QrStyle
  onContentChange: (next: QrContent) => void
  onStyleChange: (next: QrStyle) => void
}

export default function Form({ content, style, onContentChange, onStyleChange }: FormProps) {
  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
      <Accordion allowsMultipleExpanded defaultExpandedKeys={['content', 'style', 'settings']}>
        <Section id="content" label="Content" icon={IconForms}>
          <ContentFields content={content} onChange={onContentChange} />
        </Section>
        <Section id="style" label="Style" icon={IconPalette}>
          <StyleFields style={style} onChange={onStyleChange} />
        </Section>
        <Section id="settings" label="Settings" icon={IconSettings}>
          <SettingsFields style={style} onChange={onStyleChange} />
        </Section>
      </Accordion>
    </div>
  )
}

interface SectionProps {
  id: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  children: ReactNode
}

function Section({ id, label, icon: Icon, children }: SectionProps) {
  return (
    <Accordion.Item id={id}>
      <Accordion.Heading>
        <Accordion.Trigger className="gap-2.5 text-sm font-medium">
          <Icon className="h-4.5 w-4.5 text-muted" />
          <span className="flex-1 text-left">{label}</span>
          <Accordion.Indicator />
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body>{children}</Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
