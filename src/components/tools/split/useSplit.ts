import { useCallback, useEffect, useState } from 'react'
import type { Expense, SplitState } from './types'

const KEY = 'split:state'
const EMPTY: SplitState = { people: [], expenses: [] }

function load(): SplitState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as SplitState
  } catch {}
  return EMPTY
}

export function useSplit() {
  const [state, setState] = useState<SplitState>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const addPerson = useCallback((name: string) => {
    const n = name.trim()
    if (!n) return
    setState((s) => ({ ...s, people: [...s.people, { id: crypto.randomUUID(), name: n }] }))
  }, [])

  const removePerson = useCallback((id: string) => {
    setState((s) =>
      s.expenses.some((e) => e.paidBy === id || id in e.shares)
        ? s
        : { ...s, people: s.people.filter((p) => p.id !== id) },
    )
  }, [])

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setState((s) => ({ ...s, expenses: [{ ...e, id: crypto.randomUUID() }, ...s.expenses] }))
  }, [])

  const removeExpense = useCallback((id: string) => {
    setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) }))
  }, [])

  const reset = useCallback(() => setState(EMPTY), [])

  return { ...state, addPerson, removePerson, addExpense, removeExpense, reset }
}
