import { useState } from 'react'
import Balances from './Balances'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import People from './People'
import Toolbar from './Toolbar'
import { useSplit } from './useSplit'

export default function SplitTool() {
  const { people, expenses, addPerson, removePerson, addExpense, removeExpense, reset } = useSplit()
  const [adding, setAdding] = useState(false)

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-surface-secondary">
      <Toolbar canAdd={people.length > 1} onAdd={() => setAdding(true)} canReset={people.length > 0 || expenses.length > 0} onReset={reset} />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
        <div className="min-w-0 space-y-6 bg-surface p-4 md:w-1/2 md:overflow-y-auto md:border-r md:border-border">
          <ExpenseList people={people} expenses={expenses} onRemove={removeExpense} />
        </div>
        <div className="min-w-0 space-y-6 p-4 md:w-1/2 md:overflow-y-auto">
          <People people={people} expenses={expenses} onAdd={addPerson} onRemove={removePerson} />
          <Balances people={people} expenses={expenses} />
        </div>
      </div>

      <ExpenseForm isOpen={adding} people={people} onAdd={addExpense} onClose={() => setAdding(false)} />
    </div>
  )
}
