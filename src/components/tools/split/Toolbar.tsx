import { Button, Toolbar as HuiToolbar } from '@heroui/react'
import { ToolPageToolbar } from '#/components/ToolPageToolbar'
import IconTrash from '~icons/tabler/trash'

interface ToolbarProps {
  canReset: boolean
  onReset: () => void
}

export default function Toolbar({ canReset, onReset }: ToolbarProps) {
  return (
    <ToolPageToolbar>
      <HuiToolbar aria-label="Split options" className="flex w-full items-center justify-end gap-2">
        <Button size="sm" variant="tertiary" onPress={onReset} isDisabled={!canReset}>
          <IconTrash className="h-4 w-4" />
          Reset
        </Button>
      </HuiToolbar>
    </ToolPageToolbar>
  )
}
