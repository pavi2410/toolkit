import { useCallback, useEffect, useState } from 'react'
import type { Expense, SplitState, Transfer } from './types'

const KEY = 'split:state'
const EMPTY: SplitState = { people: [], expenses: [] }

function load(): SplitState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as SplitState
  } catch {}
  return EMPTY
}

const LIMIT = 50

interface History {
  past: SplitState[]
  present: SplitState
  future: SplitState[]
}

export function useSplit() {
  const [{ past, present: state, future }, setHistory] = useState<History>(() => ({
    past: [],
    present: load(),
    future: [],
  }))

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  const setState = useCallback((fn: (s: SplitState) => SplitState) => {
    setHistory((h) => {
      const next = fn(h.present)
      if (next === h.present) return h
      return { past: [...h.past, h.present].slice(-LIMIT), present: next, future: [] }
    })
  }, [])

  const undo = useCallback(() => {
    setHistory((h) =>
      h.past.length
        ? { past: h.past.slice(0, -1), present: h.past[h.past.length - 1], future: [h.present, ...h.future] }
        : h,
    )
  }, [])

  const redo = useCallback(() => {
    setHistory((h) =>
      h.future.length
        ? { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1) }
        : h,
    )
  }, [])

  const addPeople = useCallback((input: string) => {
    const names = input.split(',').map((n) => n.trim()).filter(Boolean)
    if (!names.length) return
    setState((s) => ({
      ...s,
      people: [...s.people, ...names.map((name) => ({ id: crypto.randomUUID(), name }))],
    }))
  }, [setState])

  const removePerson = useCallback((id: string) => {
    setState((s) =>
      s.expenses.some((e) => e.paidBy === id || id in e.shares)
        ? s
        : { ...s, people: s.people.filter((p) => p.id !== id) },
    )
  }, [setState])

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setState((s) => ({ ...s, expenses: [{ ...e, id: crypto.randomUUID() }, ...s.expenses] }))
  }, [setState])

  const updateExpense = useCallback((id: string, e: Omit<Expense, 'id'>) => {
    setState((s) => ({ ...s, expenses: s.expenses.map((x) => (x.id === id ? { ...e, id } : x)) }))
  }, [setState])

  const settle = useCallback((t: Transfer) => {
    addExpense({
      title: 'Settlement',
      amount: t.amount,
      paidBy: t.from,
      shares: { [t.to]: t.amount },
      settlement: true,
    })
  }, [addExpense])

  const removeExpense = useCallback((id: string) => {
    setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) }))
  }, [setState])

  const reset = useCallback(() => setState((s) => (s.people.length || s.expenses.length ? EMPTY : s)), [setState])

  return { ...state, canUndo: past.length > 0, canRedo: future.length > 0, undo, redo, addPeople, removePerson, addExpense, updateExpense, settle, removeExpense, reset }
}
