import { useState, type FormEvent } from 'react'
import { Button, Input } from '@heroui/react'
import IconX from '~icons/tabler/x'
import type { Expense, Person } from './types'

interface PeopleProps {
  people: Person[]
  expenses: Expense[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
}

export default function People({ people, expenses, onAdd, onRemove }: PeopleProps) {
  const [name, setName] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onAdd(name)
    setName('')
  }

  const inUse = (id: string) => expenses.some((e) => e.paidBy === id || id in e.shares)

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">People</h2>
      <form onSubmit={submit} className="flex gap-2">
        <Input aria-label="Name" placeholder="Add person" value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 flex-1" />
        <Button type="submit" size="sm" variant="primary" isDisabled={!name.trim()}>
          Add
        </Button>
      </form>
      <ul className="flex flex-wrap gap-2">
        {people.map((p) => (
          <li key={p.id} className="flex items-center gap-1 rounded-full bg-surface-secondary py-1 pl-3 pr-1 text-sm">
            {p.name}
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              aria-label={`Remove ${p.name}`}
              isDisabled={inUse(p.id)}
              onPress={() => onRemove(p.id)}
            >
              <IconX className="h-3 w-3" />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
