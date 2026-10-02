import { Button, Modal } from '@heroui/react'
import type { SplitState } from './types'

interface ImportModalProps {
  incoming: SplitState | null
  onConfirm: () => void
  onClose: () => void
}

export default function ImportModal({ incoming, onConfirm, onClose }: ImportModalProps) {
  return (
    <Modal isOpen={incoming !== null} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Open shared split?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm text-muted">
                This link has {incoming?.people.length} people and {incoming?.expenses.length} entries. It replaces your current data; you can undo afterwards.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={onClose}>Cancel</Button>
              <Button variant="primary" onPress={onConfirm}>Open</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
