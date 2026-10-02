import { useState, type FormEvent } from 'react'
import { Button, Input, Tag, TagGroup } from '@heroui/react'
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
        <Input aria-label="Name" placeholder="Add people (comma-separated)" value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 flex-1" />
        <Button type="submit" size="sm" variant="primary" isDisabled={!name.trim()}>
          Add
        </Button>
      </form>
      <TagGroup
        aria-label="People"
        disabledKeys={people.filter((p) => inUse(p.id)).map((p) => p.id)}
        onRemove={(keys) => keys.forEach((k) => onRemove(String(k)))}
      >
        <TagGroup.List items={people}>
          {(p) => <Tag id={p.id}>{p.name}</Tag>}
        </TagGroup.List>
      </TagGroup>
      {people.some((p) => inUse(p.id)) && (
        <p className="text-xs text-muted">People in an expense can't be removed. Delete their expenses first.</p>
      )}
    </section>
  )
}
