import { useState, type FormEvent } from 'react'
import { Button, Checkbox, CheckboxGroup, Input, Label, ListBox, Modal, Select, Switch } from '@heroui/react'
import { equalShares, fmt, toCents } from './calc'
import type { Expense, Person } from './types'

interface ExpenseFormProps {
  isOpen: boolean
  people: Person[]
  /** expense being edited; omit to create */
  expense?: Expense
  onSave: (e: Omit<Expense, 'id'>) => void
  onClose: () => void
}

export default function ExpenseForm({ isOpen, people, expense, onSave, onClose }: ExpenseFormProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Fields people={people} expense={expense} onSave={onSave} onClose={onClose} />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

function isCustom(e: Expense) {
  const eq = equalShares(e.amount, Object.keys(e.shares))
  return Object.entries(e.shares).some(([id, v]) => eq[id] !== v)
}

function Fields({ people, expense, onSave, onClose }: Omit<ExpenseFormProps, 'isOpen'>) {
  const [title, setTitle] = useState(expense?.title ?? '')
  const [amount, setAmount] = useState(expense ? fmt(expense.amount) : '')
  const [paidBy, setPaidBy] = useState(expense?.paidBy ?? '')
  const [picked, setPicked] = useState<string[] | null>(expense ? Object.keys(expense.shares) : null) // null = everyone
  const [custom, setCustom] = useState(expense ? isCustom(expense) : false)
  const [amounts, setAmounts] = useState<Record<string, string>>(
    expense && isCustom(expense)
      ? Object.fromEntries(Object.entries(expense.shares).map(([id, v]) => [id, fmt(v)]))
      : {},
  )
  const [tried, setTried] = useState(false)

  const payer = people.some((p) => p.id === paidBy) ? paidBy : (people[0]?.id ?? '')
  const ids = (picked ?? people.map((p) => p.id)).filter((id) => people.some((p) => p.id === id))
  const total = toCents(amount)
  const equal = total > 0 && ids.length ? equalShares(total, ids) : {}
  const customSum = ids.reduce((s, id) => s + toCents(amounts[id] ?? ''), 0)

  const error = !title.trim()
    ? 'Enter a description.'
    : total <= 0
      ? 'Enter an amount greater than 0.'
      : ids.length === 0
        ? 'Select at least one person to split with.'
        : custom && customSum !== total
          ? `Amounts must add up to ${fmt(total)} (${fmt(total - customSum)} left).`
          : null

  const toggleCustom = (on: boolean) => {
    setCustom(on)
    if (on) setAmounts(Object.fromEntries(ids.map((id) => [id, fmt(equal[id] ?? 0)])))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (error) return
    const shares = custom
      ? Object.fromEntries(ids.map((id) => [id, toCents(amounts[id] ?? '')]))
      : equal
    onSave({ title: title.trim(), amount: total, paidBy: payer, shares })
    onClose()
  }

  return (
    <form onSubmit={submit} className="contents">
      <Modal.Header>
        <Modal.Heading>{expense ? 'Edit expense' : 'New expense'}</Modal.Heading>
      </Modal.Header>
      <Modal.Body className="space-y-4">
        <div className="flex gap-2">
          <Input
            aria-label="Description"
            placeholder="Description"
            autoFocus
            variant="secondary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-w-0 flex-1"
          />
          <Input
            aria-label="Amount"
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            variant="secondary"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32"
          />
        </div>

        <Select variant="secondary" selectedKey={payer} onSelectionChange={(k) => setPaidBy(String(k))} fullWidth>
          <Label>Paid by</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox items={people}>
              {(p) => <ListBox.Item id={p.id} textValue={p.name}>{p.name}<ListBox.ItemIndicator /></ListBox.Item>}
            </ListBox>
          </Select.Popover>
        </Select>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Split between</span>
            <Switch size="sm" isSelected={custom} onChange={toggleCustom}>
              <Switch.Content className="flex items-center gap-2 whitespace-nowrap">
                <Switch.Control><Switch.Thumb /></Switch.Control>
                <span className="text-sm text-muted">Custom amounts</span>
              </Switch.Content>
            </Switch>
          </div>
          <CheckboxGroup aria-label="Split between" value={ids} onChange={setPicked}>
            {people.map((p) => (
              <div key={p.id} className="flex h-10 items-center gap-3">
                <Checkbox value={p.id} className="min-w-0 flex-1">
                  <Checkbox.Content className="flex items-center gap-2">
                    <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                    <span className="truncate text-sm">{p.name}</span>
                  </Checkbox.Content>
                </Checkbox>
                {ids.includes(p.id) &&
                  (custom ? (
                    <Input
                      aria-label={`${p.name} amount`}
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      variant="secondary"
                      value={amounts[p.id] ?? ''}
                      onChange={(e) => setAmounts({ ...amounts, [p.id]: e.target.value })}
                      className="w-28"
                    />
                  ) : (
                    <span className="w-28 pr-3 text-right text-sm text-muted tabular-nums">{fmt(equal[p.id] ?? 0)}</span>
                  ))}
              </div>
            ))}
          </CheckboxGroup>
        </div>

        {(tried || (custom && total > 0)) && error && <p role="alert" className="text-sm text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onPress={onClose}>Cancel</Button>
        <Button type="submit" variant="primary">{expense ? 'Save' : 'Add expense'}</Button>
      </Modal.Footer>
    </form>
  )
}
