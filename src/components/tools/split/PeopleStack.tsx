import { Button } from '@heroui/react'
import IconUsers from '~icons/tabler/users'
import PersonAvatar from './PersonAvatar'
import type { Person } from './types'

const MAX = 5

interface PeopleStackProps {
  people: Person[]
  onPress: () => void
}

export default function PeopleStack({ people, onPress }: PeopleStackProps) {
  if (people.length === 0) {
    return (
      <Button size="sm" variant="secondary" onPress={onPress}>
        <IconUsers className="h-4 w-4" />
        Add people
      </Button>
    )
  }

  return (
    <>
      <Button size="sm" variant="secondary" aria-label={`People (${people.length})`} onPress={onPress} className="sm:hidden">
        <IconUsers className="h-4 w-4" />
        {people.length}
      </Button>
      <button
        type="button"
        aria-label={`People (${people.length})`}
        title="Edit people"
        onClick={onPress}
        className="hidden items-center rounded-full p-0.5 outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-focus sm:flex"
      >
        {people.slice(0, MAX).map((p) => (
          <span key={p.id} className="-ml-2 rounded-full ring-2 ring-surface first:ml-0">
            <PersonAvatar person={p} />
          </span>
        ))}
        {people.length > MAX && (
          <span className="-ml-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-surface-secondary px-1 text-xs text-muted ring-2 ring-surface">
            +{people.length - MAX}
          </span>
        )}
      </button>
    </>
  )
}
