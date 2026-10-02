export interface Person {
  id: string
  name: string
}

export interface Expense {
  id: string
  title: string
  /** cents */
  amount: number
  paidBy: string
  /** personId -> cents owed */
  shares: Record<string, number>
  /** payment between two people, not a shared cost */
  settlement?: boolean
}

export interface SplitState {
  people: Person[]
  expenses: Expense[]
}

export interface Transfer {
  from: string
  to: string
  amount: number
}
