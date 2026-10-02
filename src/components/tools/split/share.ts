import type { Expense, SplitState } from './types'

/** [people names, expenses: [title, cents, payerIdx, [personIdx, share][], settlement 0|1][]] */
type Wire = [string[], [string, number, number, [number, number][], 0 | 1][]]

export const MAX_URL = 2000
const MAX_PEOPLE = 50
const MAX_EXPENSES = 500

async function pipe(data: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const res = new Response(new Blob([data as BlobPart]).stream().pipeThrough(stream))
  return new Uint8Array(await res.arrayBuffer())
}

function toB64(bytes: Uint8Array) {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64(s: string) {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(b, (c) => c.charCodeAt(0))
}

export async function encodeState({ people, expenses }: SplitState) {
  const idx = new Map(people.map((p, i) => [p.id, i]))
  const wire: Wire = [
    people.map((p) => p.name),
    expenses.map((e) => [
      e.title,
      e.amount,
      idx.get(e.paidBy) ?? 0,
      Object.entries(e.shares).flatMap(([id, v]) => (idx.has(id) ? [[idx.get(id)!, v] as [number, number]] : [])),
      e.settlement ? 1 : 0,
    ]),
  ]
  const packed = await pipe(new TextEncoder().encode(JSON.stringify(wire)), new CompressionStream('deflate-raw'))
  return toB64(packed)
}

const isCents = (n: unknown): n is number => Number.isInteger(n) && (n as number) >= 0
const isText = (s: unknown, max: number): s is string => typeof s === 'string' && s.trim().length > 0 && s.length <= max

/** Returns null for anything malformed. */
export async function decodeState(payload: string): Promise<SplitState | null> {
  try {
    const raw = await pipe(fromB64(payload), new DecompressionStream('deflate-raw'))
    const [names, exps] = JSON.parse(new TextDecoder().decode(raw)) as Wire
    if (!Array.isArray(names) || !Array.isArray(exps)) return null
    if (names.length > MAX_PEOPLE || exps.length > MAX_EXPENSES || !names.every((n) => isText(n, 60))) return null

    const people = names.map((name) => ({ id: crypto.randomUUID(), name: name.trim() }))
    const expenses: Expense[] = []
    for (const [title, amount, payer, shares, settlement] of exps) {
      if (!isText(title, 100) || !isCents(amount) || amount <= 0 || !people[payer] || !Array.isArray(shares) || !shares.length) return null
      const map: Record<string, number> = {}
      for (const [i, v] of shares) {
        if (!people[i] || !isCents(v)) return null
        map[people[i].id] = v
      }
      expenses.push({
        id: crypto.randomUUID(),
        title: title.trim(),
        amount,
        paidBy: people[payer].id,
        shares: map,
        ...(settlement ? { settlement: true } : {}),
      })
    }
    return { people, expenses }
  } catch {
    return null
  }
}
