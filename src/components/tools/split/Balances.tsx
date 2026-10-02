import { useMemo } from 'react'
import { Button } from '@heroui/react'
import IconCheck from '~icons/tabler/check'
import { balances, fmt, settle } from './calc'
import type { Expense, Person, Transfer } from './types'

interface BalancesProps {
  people: Person[]
  expenses: Expense[]
  onSettle: (t: Transfer) => void
}

export default function Balances({ people, expenses, onSettle }: BalancesProps) {
  const { bal, transfers } = useMemo(() => {
    const bal = balances(expenses)
    return { bal, transfers: settle(bal) }
  }, [expenses])
  const name = (id: string) => people.find((p) => p.id === id)?.name ?? '?'

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Balances</h2>
        <ul className="space-y-1 text-sm">
          {people.map((p) => {
            const v = bal[p.id] ?? 0
            return (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span className={`tabular-nums ${v > 0 ? 'text-success' : v < 0 ? 'text-danger' : 'text-muted'}`}>
                  {v > 0 ? `gets ${fmt(v)}` : v < 0 ? `owes ${fmt(-v)}` : 'settled'}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Settle up</h2>
        {transfers.length === 0 ? (
          <p className="text-sm text-muted">All settled.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {transfers.map((t) => (
              <li key={`${t.from}-${t.to}`} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate">{name(t.from)} → {name(t.to)}</span>
                <span className="w-20 shrink-0 text-right tabular-nums">{fmt(t.amount)}</span>
                <Button size="sm" variant="tertiary" onPress={() => onSettle(t)}>
                  <IconCheck className="h-4 w-4" />
                  Mark paid
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
