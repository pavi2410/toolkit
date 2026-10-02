import { useState, type FormEvent } from 'react'
import { Button, Input, Modal, Tag, TagGroup } from '@heroui/react'
import PersonAvatar from './PersonAvatar'
import type { Expense, Person } from './types'

interface PeopleModalProps {
  isOpen: boolean
  people: Person[]
  expenses: Expense[]
  onAdd: (names: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}

export default function PeopleModal({ isOpen, people, expenses, onAdd, onRemove, onClose }: PeopleModalProps) {
  const [name, setName] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onAdd(name)
    setName('')
  }

  const inUse = (id: string) => expenses.some((e) => e.paidBy === id || id in e.shares)

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>People</Modal.Heading>
              <p className="text-sm text-muted">Who's splitting expenses? Add several at once, separated by commas.</p>
            </Modal.Header>
            <Modal.Body className="space-y-4">
              <form onSubmit={submit} className="flex gap-2">
                <Input
                  aria-label="Name"
                  placeholder="Alice, Bob, Carol"
                  autoFocus
                  variant="secondary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-w-0 flex-1"
                />
                <Button type="submit" variant="primary" isDisabled={!name.trim()}>
                  Add
                </Button>
              </form>

              {people.length > 0 && (
                <TagGroup
                  aria-label="People"
                  disabledKeys={people.filter((p) => inUse(p.id)).map((p) => p.id)}
                  onRemove={(keys) => keys.forEach((k) => onRemove(String(k)))}
                >
                  <TagGroup.List items={people}>
                    {(p) => (
                      <Tag id={p.id} textValue={p.name}>
                        <span className="flex items-center gap-1.5"><PersonAvatar person={p} />{p.name}</span>
                      </Tag>
                    )}
                  </TagGroup.List>
                </TagGroup>
              )}

              {people.some((p) => inUse(p.id)) && (
                <p className="text-xs text-muted">People in an expense can't be removed. Delete their expenses first.</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onPress={onClose}>Done</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
