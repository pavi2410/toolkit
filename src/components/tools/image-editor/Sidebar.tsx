import { useStore } from '@nanostores/react'
import { $activePanel, actions } from '@/stores/image-editor'
import { Tabs } from '@heroui/react'
import IconResize from '~icons/tabler/resize'
import IconCrop from '~icons/tabler/crop'
import IconAdjustments from '~icons/tabler/adjustments'
import IconFileExport from '~icons/tabler/file-export'
import ResizePanel from './panels/ResizePanel'
import CropPanel from './panels/CropPanel'
import AdjustPanel from './panels/AdjustPanel'
import FormatPanel from './panels/FormatPanel'

const PANELS = [
  { id: 'resize' as const, label: 'Resize', icon: IconResize },
  { id: 'crop' as const, label: 'Crop', icon: IconCrop },
  { id: 'adjust' as const, label: 'Adjust', icon: IconAdjustments },
  { id: 'format' as const, label: 'Export', icon: IconFileExport },
]

export default function Sidebar() {
  const activePanel = useStore($activePanel)

  return (
    <Tabs
      selectedKey={activePanel}
      onSelectionChange={key => actions.setPanel(key as typeof activePanel)}
      orientation="vertical"
      className="w-72 shrink-0 border-r border-border bg-surface flex flex-col h-full"
    >
      <Tabs.List className="flex flex-row border-b border-border w-full">
        {PANELS.map(({ id, label, icon: Icon }) => (
          <Tabs.Tab key={id} id={id} className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium">
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            <Tabs.Indicator />
          </Tabs.Tab>
        ))}
      </Tabs.List>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs.Panel id="resize"><ResizePanel /></Tabs.Panel>
        <Tabs.Panel id="crop"><CropPanel /></Tabs.Panel>
        <Tabs.Panel id="adjust"><AdjustPanel /></Tabs.Panel>
        <Tabs.Panel id="format"><FormatPanel /></Tabs.Panel>
      </div>
    </Tabs>
  )
}
