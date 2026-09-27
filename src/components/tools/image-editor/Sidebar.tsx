import { useStore } from '@nanostores/react'
import { $activePanel, actions, type EditorPanel } from '@/stores/image-editor'
import { Accordion } from '@heroui/react'
import IconResize from '~icons/tabler/resize'
import IconCrop from '~icons/tabler/crop'
import IconAdjustments from '~icons/tabler/adjustments'
import IconFileExport from '~icons/tabler/file-export'
import ResizePanel from './panels/ResizePanel'
import CropPanel from './panels/CropPanel'
import AdjustPanel from './panels/AdjustPanel'
import FormatPanel from './panels/FormatPanel'

const PANELS = [
  { id: 'resize', label: 'Resize', icon: IconResize, Panel: ResizePanel },
  { id: 'crop', label: 'Crop', icon: IconCrop, Panel: CropPanel },
  { id: 'adjust', label: 'Adjust', icon: IconAdjustments, Panel: AdjustPanel },
  { id: 'format', label: 'Export', icon: IconFileExport, Panel: FormatPanel },
] as const

export default function Sidebar() {
  const activePanel = useStore($activePanel)

  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-r border-border bg-surface">
      <Accordion
        expandedKeys={activePanel ? [activePanel] : []}
        onExpandedChange={keys => actions.setPanel(([...keys][0] as EditorPanel | undefined) ?? null)}
      >
        {PANELS.map(({ id, label, icon: Icon, Panel }) => (
          <Accordion.Item key={id} id={id}>
            <Accordion.Heading>
              <Accordion.Trigger className="gap-2.5 text-sm font-medium">
                <Icon className="h-4.5 w-4.5 text-muted" />
                <span className="flex-1 text-left">{label}</span>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <Panel />
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </aside>
  )
}
