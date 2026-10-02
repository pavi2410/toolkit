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
