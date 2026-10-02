import type { Expense, Transfer } from './types'

export const toCents = (v: string) => Math.round((parseFloat(v) || 0) * 100)

export const fmt = (cents: number) => (cents / 100).toFixed(2)

export function equalShares(amount: number, ids: string[]) {
  const base = Math.floor(amount / ids.length)
  let rem = amount - base * ids.length
  return Object.fromEntries(ids.map((id) => [id, base + (rem-- > 0 ? 1 : 0)]))
}

/** + = is owed, - = owes */
export function balances(expenses: Expense[]) {
  const b: Record<string, number> = {}
  for (const e of expenses) {
    b[e.paidBy] = (b[e.paidBy] ?? 0) + e.amount
    for (const [id, s] of Object.entries(e.shares)) b[id] = (b[id] ?? 0) - s
  }
  return b
}

export function settle(b: Record<string, number>): Transfer[] {
  const cr = Object.entries(b).filter(([, v]) => v > 0).sort((x, y) => y[1] - x[1])
  const db = Object.entries(b)
    .filter(([, v]) => v < 0)
    .map(([k, v]) => [k, -v] as [string, number])
    .sort((x, y) => y[1] - x[1])
  const out: Transfer[] = []
  let i = 0
  let j = 0
  while (i < db.length && j < cr.length) {
    const amount = Math.min(db[i][1], cr[j][1])
    out.push({ from: db[i][0], to: cr[j][0], amount })
    db[i][1] -= amount
    cr[j][1] -= amount
    if (!db[i][1]) i++
    if (!cr[j][1]) j++
  }
  return out
}
