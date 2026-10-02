import { Avatar } from '@heroui/react'
import { Avatar as DiceAvatar, Style } from '@dicebear/core'
import critters from '@dicebear/styles/critters.json'
import type { Person } from './types'

const style = new Style(critters)
const cache = new Map<string, string>()

function avatarUri(seed: string) {
  let uri = cache.get(seed)
  if (!uri) {
    uri = new DiceAvatar(style, { seed }).toDataUri()
    cache.set(seed, uri)
  }
  return uri
}

export default function PersonAvatar({ person, size = 'sm' }: { person: Person; size?: 'sm' | 'md' }) {
  return (
    <Avatar size={size} className="shrink-0">
      <Avatar.Image src={avatarUri(person.name.trim().toLowerCase())} alt="" />
      <Avatar.Fallback>{person.name.slice(0, 1).toUpperCase()}</Avatar.Fallback>
    </Avatar>
  )
}
