import { Avatar, AvatarGroup, Button } from '@heroui/react'
import IconUsers from '~icons/tabler/users'
import { avatarUri } from './PersonAvatar'
import type { Person } from './types'

const MAX = 3

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
        <AvatarGroup size="sm" max={MAX} overlap="ring">
          {people.map((p) => (
            <Avatar key={p.id}>
              <Avatar.Image src={avatarUri(p.name.trim().toLowerCase())} alt="" />
              <Avatar.Fallback>{p.name.slice(0, 1).toUpperCase()}</Avatar.Fallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </button>
    </>
  )
}
