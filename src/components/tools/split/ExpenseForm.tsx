import { useState, type FormEvent } from 'react'
import { Button, Input } from '@heroui/react'
import { equalShares, fmt, toCents } from './calc'
import type { Expense, Person } from './types'

interface ExpenseFormProps {
  people: Person[]
  onAdd: (e: Omit<Expense, 'id'>) => void
}

export default function ExpenseForm({ people, onAdd }: ExpenseFormProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [picked, setPicked] = useState<string[] | null>(null) // null = everyone
  const [custom, setCustom] = useState(false)
  const [amounts, setAmounts] = useState<Record<string, string>>({})

  const payer = people.some((p) => p.id === paidBy) ? paidBy : (people[0]?.id ?? '')
  const ids = (picked ?? people.map((p) => p.id)).filter((id) => people.some((p) => p.id === id))
  const total = toCents(amount)
  const customSum = ids.reduce((s, id) => s + toCents(amounts[id] ?? ''), 0)
  const valid = title.trim() && total > 0 && payer && ids.length > 0 && (!custom || customSum === total)

  const toggle = (id: string) =>
    setPicked(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!valid) return
    const shares = custom
      ? Object.fromEntries(ids.map((id) => [id, toCents(amounts[id] ?? '')]))
      : equalShares(total, ids)
    onAdd({ title: title.trim(), amount: total, paidBy: payer, shares })
    setTitle('')
    setAmount('')
    setAmounts({})
  }

  if (people.length < 2) {
    return <p className="text-sm text-muted">Add at least two people to start adding expenses.</p>
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">New expense</h2>
      <div className="flex gap-2">
        <Input aria-label="Description" placeholder="Description" value={title} onChange={(e) => setTitle(e.target.value)} className="min-w-0 flex-1" />
        <Input aria-label="Amount" placeholder="0.00" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-28" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        Paid by
        <select
          value={payer}
          onChange={(e) => setPaidBy(e.target.value)}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm"
        >
          {people.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span>Split between</span>
          <label className="flex items-center gap-1.5 text-muted">
            <input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} />
            Custom amounts
          </label>
        </div>
        {people.map((p) => (
          <div key={p.id} className="flex items-center gap-2 text-sm">
            <label className="flex flex-1 items-center gap-2">
              <input type="checkbox" checked={ids.includes(p.id)} onChange={() => toggle(p.id)} />
              {p.name}
            </label>
            {ids.includes(p.id) &&
              (custom ? (
                <Input
                  aria-label={`${p.name} amount`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={amounts[p.id] ?? ''}
                  onChange={(e) => setAmounts({ ...amounts, [p.id]: e.target.value })}
                  className="w-24"
                />
              ) : (
                <span className="text-muted tabular-nums">{fmt(equalShares(total, ids)[p.id] ?? 0)}</span>
              ))}
          </div>
        ))}
        {custom && total > 0 && customSum !== total && (
          <p className="text-xs text-danger">Amounts add up to {fmt(customSum)} of {fmt(total)}.</p>
        )}
      </div>

      <Button type="submit" variant="primary" isDisabled={!valid}>
        Add expense
      </Button>
    </form>
  )
}
