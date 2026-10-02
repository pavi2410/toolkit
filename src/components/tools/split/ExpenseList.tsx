import { Button } from '@heroui/react'
import IconArrowBackUp from '~icons/tabler/arrow-back-up'
import IconPencil from '~icons/tabler/pencil'
import IconTrash from '~icons/tabler/trash'
import { fmt } from './calc'
import type { Expense, Person } from './types'

interface ExpenseListProps {
  people: Person[]
  expenses: Expense[]
  onEdit: (e: Expense) => void
  onRemove: (id: string) => void
}

export default function ExpenseList({ people, expenses, onEdit, onRemove }: ExpenseListProps) {
  const name = (id: string) => people.find((p) => p.id === id)?.name ?? '?'

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-foreground">Expenses</h2>
      {expenses.length === 0 && <p className="text-sm text-muted">No expenses yet. Add at least two people, then add an expense.</p>}
      <ul className="divide-y divide-border">
        {expenses.map((e) => (
          <li key={e.id} className="flex items-center gap-3 py-2">
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-medium ${e.settlement ? 'text-success' : ''}`}>{e.title}</p>
              <p className="truncate text-xs text-muted">
                {e.settlement
                  ? `${name(e.paidBy)} paid ${name(Object.keys(e.shares)[0])}`
                  : `${name(e.paidBy)} paid · split ${Object.keys(e.shares).length} way`}
              </p>
            </div>
            <span className="w-20 shrink-0 text-right text-sm tabular-nums">{fmt(e.amount)}</span>
            <div className="flex w-[4.5rem] shrink-0 justify-end">
              {!e.settlement && (
                <Button isIconOnly size="sm" variant="ghost" aria-label={`Edit ${e.title}`} onPress={() => onEdit(e)}>
                  <IconPencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                aria-label={`${e.settlement ? 'Revert' : 'Delete'} ${e.title}`}
                onPress={() => onRemove(e.id)}
              >
                {e.settlement ? <IconArrowBackUp className="h-4 w-4" /> : <IconTrash className="h-4 w-4" />}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
