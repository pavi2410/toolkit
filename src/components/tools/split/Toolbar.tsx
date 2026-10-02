import { Button, Toolbar as HuiToolbar } from '@heroui/react'
import { ToolPageToolbar } from '#/components/ToolPageToolbar'
import IconPlus from '~icons/tabler/plus'
import IconTrash from '~icons/tabler/trash'

interface ToolbarProps {
  canAdd: boolean
  canReset: boolean
  onAdd: () => void
  onReset: () => void
}

export default function Toolbar({ canAdd, canReset, onAdd, onReset }: ToolbarProps) {
  return (
    <ToolPageToolbar>
      <HuiToolbar aria-label="Split options" className="flex w-full items-center justify-between gap-2">
        <Button size="sm" variant="primary" onPress={onAdd} isDisabled={!canAdd}>
          <IconPlus className="h-4 w-4" />
          Add expense
        </Button>
        <Button size="sm" variant="tertiary" onPress={onReset} isDisabled={!canReset}>
          <IconTrash className="h-4 w-4" />
          Reset
        </Button>
      </HuiToolbar>
    </ToolPageToolbar>
  )
}
