import { useEffect, useRef, useState } from 'react'
import type { Expense, SplitState } from './types'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import ImportModal from './ImportModal'
import PeopleModal from './PeopleModal'
import Summary from './Summary'
import Toolbar from './Toolbar'
import { decodeState } from './share'
import { useShare } from './useShare'
import { useSplit } from './useSplit'

export default function SplitTool() {
  const { people, expenses, addPeople, removePerson, addExpense, updateExpense, settle, removeExpense, reset, load, canUndo, canRedo, undo, redo } = useSplit()
  const { status: shareStatus, copy: copyLink } = useShare({ people, expenses })
  // open people first when there is nobody yet (first load or after reset)
  const [peopleOpen, setPeopleOpen] = useState(people.length === 0)
  // undefined = closed, null = new expense, Expense = editing
  const [editing, setEditing] = useState<Expense | null | undefined>(undefined)

  const [incoming, setIncoming] = useState<SplitState | null>(null)
  const hasData = useRef(false)
  hasData.current = people.length > 0 || expenses.length > 0

  // open a shared link (#s=...)
  useEffect(() => {
    const importHash = () => {
      const m = location.hash.match(/^#s=([\w-]+)$/)
      if (!m) return
      history.replaceState(null, '', location.pathname + location.search)
      void decodeState(m[1]).then((s) => {
        if (!s) return
        if (hasData.current) {
          setIncoming(s)
        } else {
          load(s)
          setPeopleOpen(false)
        }
      })
    }
    importHash()
    window.addEventListener('hashchange', importHash)
    return () => window.removeEventListener('hashchange', importHash)
  }, [load])

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
        canShare={people.length > 0}
        shareStatus={shareStatus}
        onShare={copyLink}
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

      <ImportModal
        incoming={incoming}
        onConfirm={() => {
          if (incoming) load(incoming)
          setIncoming(null)
        }}
        onClose={() => setIncoming(null)}
      />
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
