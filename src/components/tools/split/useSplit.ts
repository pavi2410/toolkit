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

  const addPeople = useCallback((input: string) => {
    const names = input.split(',').map((n) => n.trim()).filter(Boolean)
    if (!names.length) return
    setState((s) => ({
      ...s,
      people: [...s.people, ...names.map((name) => ({ id: crypto.randomUUID(), name }))],
    }))
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

  return { ...state, addPeople, removePerson, addExpense, removeExpense, reset }
}
