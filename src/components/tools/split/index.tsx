import { useEffect, useState } from 'react'
import type { Expense } from './types'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import PeopleModal from './PeopleModal'
import Summary from './Summary'
import Toolbar from './Toolbar'
import { useSplit } from './useSplit'

export default function SplitTool() {
  const { people, expenses, addPeople, removePerson, addExpense, updateExpense, settle, removeExpense, reset, canUndo, canRedo, undo, redo } = useSplit()
  // open people first when there is nobody yet (first load or after reset)
  const [peopleOpen, setPeopleOpen] = useState(people.length === 0)
  // undefined = closed, null = new expense, Expense = editing
  const [editing, setEditing] = useState<Expense | null | undefined>(undefined)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [role="dialog"]')) return
      const k = e.key.toLowerCase()
      if (k === 'z') {
        e.preventDefault()
        e.shiftKey ? redo() : undo()
      } else if (k === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-surface-secondary">
      <Toolbar
        people={people}
        onPeople={() => setPeopleOpen(true)}
        canAdd={people.length > 1}
        onAdd={() => setEditing(null)}
        canReset={people.length > 0 || expenses.length > 0}
        onReset={() => {
          reset()
          setPeopleOpen(true)
        }}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        <div className="min-w-0 p-4 md:w-1/2 md:overflow-y-auto">
          <Summary people={people} expenses={expenses} onSettle={settle} />
        </div>
        <div className="min-w-0 bg-surface p-4 md:w-1/2 md:overflow-y-auto md:border-l md:border-border">
          <ExpenseList people={people} expenses={expenses} onEdit={setEditing} onRemove={removeExpense} />
        </div>
      </div>

      <PeopleModal
        isOpen={peopleOpen}
        people={people}
        expenses={expenses}
        onAdd={addPeople}
        onRemove={removePerson}
        onClose={() => setPeopleOpen(false)}
      />
      <ExpenseForm
        isOpen={editing !== undefined}
        people={people}
        expense={editing ?? undefined}
        onSave={(e) => (editing ? updateExpense(editing.id, e) : addExpense(e))}
        onClose={() => setEditing(undefined)}
      />
    </div>
  )
}
