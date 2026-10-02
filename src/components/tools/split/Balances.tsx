import { useMemo } from 'react'
import { balances, fmt, settle } from './calc'
import type { Expense, Person } from './types'

interface BalancesProps {
  people: Person[]
  expenses: Expense[]
}

export default function Balances({ people, expenses }: BalancesProps) {
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
                  {v > 0 ? '+' : ''}{fmt(v)}
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
              <li key={`${t.from}-${t.to}`} className="flex justify-between">
                <span>{name(t.from)} → {name(t.to)}</span>
                <span className="tabular-nums">{fmt(t.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
