import { Button } from '@heroui/react'
import IconTrash from '~icons/tabler/trash'
import { fmt } from './calc'
import type { Expense, Person } from './types'

interface ExpenseListProps {
  people: Person[]
  expenses: Expense[]
  onRemove: (id: string) => void
}

export default function ExpenseList({ people, expenses, onRemove }: ExpenseListProps) {
  const name = (id: string) => people.find((p) => p.id === id)?.name ?? '?'

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-foreground">Expenses</h2>
      {expenses.length === 0 && <p className="text-sm text-muted">No expenses yet. Add at least two people, then add an expense.</p>}
      <ul className="divide-y divide-border">
        {expenses.map((e) => (
          <li key={e.id} className="flex items-center gap-3 py-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{e.title}</p>
              <p className="truncate text-xs text-muted">
                {name(e.paidBy)} paid · split {Object.keys(e.shares).length} way
              </p>
            </div>
            <span className="text-sm tabular-nums">{fmt(e.amount)}</span>
            <Button isIconOnly size="sm" variant="ghost" aria-label={`Delete ${e.title}`} onPress={() => onRemove(e.id)}>
              <IconTrash className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
