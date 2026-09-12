import { Button, ListBox, Tooltip } from '@heroui/react'
import IconFolder from '~icons/tabler/folder'
import IconRestore from '~icons/tabler/restore'
import { fileDescriptors } from './constants'
import { fileIcons } from './icons'
import PanelHeader from './PanelHeader'
import type { FileName } from './types'

interface FileExplorerProps {
  activeFile: FileName
  onSelect: (file: FileName) => void
  onReset: () => void
}

export default function FileExplorer({ activeFile, onSelect, onReset }: FileExplorerProps) {
  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-r border-border bg-surface">
      <PanelHeader title="Files" icon={IconFolder}>
        <Tooltip delay={300}>
          <Button isIconOnly size="sm" variant="ghost" onPress={onReset} aria-label="Reset to example">
            <IconRestore className="h-4 w-4" />
          </Button>
          <Tooltip.Content>Reset to example</Tooltip.Content>
        </Tooltip>
      </PanelHeader>

      <ListBox
        aria-label="Project files"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[activeFile]}
        onSelectionChange={(keys) => {
          if (keys === 'all') return
          const [key] = keys
          if (key) onSelect(key as FileName)
        }}
        className="min-h-0 flex-1 overflow-auto p-1.5"
      >
        {fileDescriptors.map(({ name }) => {
          const Icon = fileIcons[name]
          return (
            <ListBox.Item key={name} id={name} textValue={name} className="gap-2 font-mono text-xs">
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{name}</span>
            </ListBox.Item>
          )
        })}
      </ListBox>
    </aside>
  )
}
