import { useEffect, useState } from 'react'
import Balances from './Balances'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import People from './People'
import Toolbar from './Toolbar'
import { useSplit } from './useSplit'

export default function SplitTool() {
  const { people, expenses, addPeople, removePerson, addExpense, settle, removeExpense, reset, canUndo, canRedo, undo, redo } = useSplit()
  const [adding, setAdding] = useState(false)

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
      <Toolbar canAdd={people.length > 1} onAdd={() => setAdding(true)} canReset={people.length > 0 || expenses.length > 0} onReset={reset} canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        <div className="min-w-0 space-y-6 bg-surface p-4 md:w-1/2 md:overflow-y-auto md:border-r md:border-border">
          <ExpenseList people={people} expenses={expenses} onRemove={removeExpense} />
        </div>
        <div className="min-w-0 space-y-6 p-4 md:w-1/2 md:overflow-y-auto">
          <People people={people} expenses={expenses} onAdd={addPeople} onRemove={removePerson} />
          <Balances people={people} expenses={expenses} onSettle={settle} />
        </div>
      </div>

      <ExpenseForm isOpen={adding} people={people} onAdd={addExpense} onClose={() => setAdding(false)} />
    </div>
  )
}
