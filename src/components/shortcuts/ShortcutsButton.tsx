import { useEffect, useState } from 'react'
import { Button } from '@heroui/react'
import IconKeyboard from '~icons/tabler/keyboard'
import ShortcutsModal from './ShortcutsModal'

interface ShortcutsButtonProps {
  toolPath?: string
  toolName: string
}

function isTyping(target: EventTarget | null) {
  return target instanceof HTMLElement
    && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
}

export default function ShortcutsButton({ toolPath, toolName }: ShortcutsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '?' || e.metaKey || e.ctrlKey || isTyping(e.target)) return
      e.preventDefault()
      setIsOpen(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <Button isIconOnly size="sm" variant="tertiary" aria-label="Keyboard shortcuts" onPress={() => setIsOpen(true)}>
        <IconKeyboard className="h-4 w-4" />
      </Button>
      <ShortcutsModal isOpen={isOpen} onOpenChange={setIsOpen} toolPath={toolPath} toolName={toolName} />
    </>
  )
}
