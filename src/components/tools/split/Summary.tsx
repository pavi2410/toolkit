import { useMemo } from 'react'
import { Button, Surface } from '@heroui/react'
import IconCheck from '~icons/tabler/check'
import { balances, fmt, settle } from './calc'
import PersonAvatar from './PersonAvatar'
import type { Expense, Person, Transfer } from './types'

interface SummaryProps {
  people: Person[]
  expenses: Expense[]
  onSettle: (t: Transfer) => void
}

export default function Summary({ people, expenses, onSettle }: SummaryProps) {
  const { bal, transfers } = useMemo(() => {
    const bal = balances(expenses)
    return { bal, transfers: settle(bal) }
  }, [expenses])
  const due = transfers.reduce((s, t) => s + t.amount, 0)
  const person = (id: string) => people.find((p) => p.id === id)

  return (
    <div className="space-y-4">
      <Surface className="space-y-2 rounded-2xl p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-foreground">Settle up</h2>
          {due > 0 && (
            <span className="text-sm text-muted">
              Total due <span className="font-medium tabular-nums text-foreground">{fmt(due)}</span>
            </span>
          )}
        </div>
        {transfers.length === 0 ? (
          <p className="text-sm text-muted">
            {expenses.length ? 'All settled.' : 'Add an expense to see who owes whom.'}
          </p>
        ) : (
          <ul className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] items-center gap-x-2 gap-y-1 text-sm">
            {transfers.map((t) => (
              <li key={`${t.from}-${t.to}`} className="col-span-5 grid grid-cols-subgrid items-center">
                <Who p={person(t.from)} />
                <span className="text-muted">→</span>
                <Who p={person(t.to)} />
                <span className="text-right tabular-nums">{fmt(t.amount)}</span>
                <Button size="sm" variant="tertiary" aria-label="Mark paid" onPress={() => onSettle(t)}>
                  <IconCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Mark paid</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Surface>

      {people.length > 0 && (
        <Surface className="space-y-2 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-foreground">Balances</h2>
          <ul className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
            {people.map((p) => {
              const v = bal[p.id] ?? 0
              return (
                <li key={p.id} className="flex min-w-0 items-center gap-2">
                  <PersonAvatar person={p} />
                  <div className="min-w-0 leading-tight">
                    <p className="truncate">{p.name}</p>
                    <p className={`text-xs tabular-nums ${v > 0 ? 'text-success' : v < 0 ? 'text-danger' : 'text-muted'}`}>
                      {v > 0 ? `gets ${fmt(v)}` : v < 0 ? `owes ${fmt(-v)}` : 'settled'}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Surface>
      )}
    </div>
  )
}

function Who({ p }: { p?: Person }) {
  return p ? (
    <span className="flex min-w-0 items-center gap-1.5">
      <PersonAvatar person={p} />
      <span className="truncate">{p.name}</span>
    </span>
  ) : (
    <span>?</span>
  )
}
