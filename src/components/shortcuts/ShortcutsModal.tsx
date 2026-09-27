import { Kbd, Modal } from '@heroui/react'
import { getShortcuts, type ShortcutKey } from './data'

interface ShortcutsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  toolPath?: string
  toolName: string
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

function Combo({ keys }: { keys: ShortcutKey[] }) {
  return (
    <Kbd>
      {keys.map(key =>
        key === 'mod' ? <Kbd.Abbr key={key} keyValue={isMac ? 'command' : 'ctrl'} />
        : key === 'shift' ? <Kbd.Abbr key={key} keyValue="shift" />
        : <Kbd.Content key={key}>{key}</Kbd.Content>
      )}
    </Kbd>
  )
}

export default function ShortcutsModal({ isOpen, onOpenChange, toolPath, toolName }: ShortcutsModalProps) {
  const groups = getShortcuts(toolPath)

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Keyboard shortcuts</Modal.Heading>
              <p className="text-sm text-muted">{toolName}</p>
            </Modal.Header>
            <Modal.Body className="space-y-5">
              {groups.map(group => (
                <section key={group.title} className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{group.title}</h3>
                  <ul className="divide-y divide-separator">
                    {group.items.map(item => (
                      <li key={item.label} className="flex items-center justify-between gap-4 py-2 text-sm">
                        <span className="text-foreground">{item.label}</span>
                        <span className="flex items-center gap-1.5 text-muted">
                          {item.combos.map((combo, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                              {i > 0 && <span className="text-xs">or</span>}
                              <Combo keys={combo} />
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
