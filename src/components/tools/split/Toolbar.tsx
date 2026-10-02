import { Button, Toolbar as HuiToolbar } from '@heroui/react'
import { ToolPageToolbar } from '#/components/ToolPageToolbar'
import PeopleStack from './PeopleStack'
import type { Person } from './types'
import IconArrowBackUp from '~icons/tabler/arrow-back-up'
import IconArrowForwardUp from '~icons/tabler/arrow-forward-up'
import IconPlus from '~icons/tabler/plus'
import IconTrash from '~icons/tabler/trash'

interface ToolbarProps {
  people: Person[]
  onPeople: () => void
  canAdd: boolean
  canReset: boolean
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onAdd: () => void
  onReset: () => void
}

export default function Toolbar({ people, onPeople, canAdd, canReset, canUndo, canRedo, onAdd, onReset, onUndo, onRedo }: ToolbarProps) {
  return (
    <ToolPageToolbar>
      <HuiToolbar aria-label="Split options" className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <PeopleStack people={people} onPress={onPeople} />
          <Button size="sm" variant="primary" onPress={onAdd} isDisabled={!canAdd}>
            <IconPlus className="h-4 w-4" />
            Add expense
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button isIconOnly size="sm" variant="tertiary" aria-label="Undo" onPress={onUndo} isDisabled={!canUndo}>
            <IconArrowBackUp className="h-4 w-4" />
          </Button>
          <Button isIconOnly size="sm" variant="tertiary" aria-label="Redo" onPress={onRedo} isDisabled={!canRedo}>
            <IconArrowForwardUp className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="tertiary" onPress={onReset} isDisabled={!canReset}>
            <IconTrash className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </HuiToolbar>
    </ToolPageToolbar>
  )
}
