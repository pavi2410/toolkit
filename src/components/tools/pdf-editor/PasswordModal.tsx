import { Modal, Button, Alert, InputGroup } from '@heroui/react'
import IconLockOpen from '~icons/tabler/lock-open'
import IconShieldLock from '~icons/tabler/shield-lock'
import IconKey from '~icons/tabler/key'

interface UnlockModalProps {
  isOpen: boolean
  isProcessing: boolean
  password: string
  onPasswordChange: (password: string) => void
  onUnlock: () => void
  onClose: () => void
}

export function UnlockModal({
  isOpen,
  isProcessing,
  password,
  onPasswordChange,
  onUnlock,
  onClose,
}: UnlockModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Icon className="bg-warning/10 text-warning">
                <IconLockOpen className="w-6 h-6" />
              </Modal.Icon>
              <div>
                <Modal.Heading>Unlock PDF</Modal.Heading>
                <p className="text-sm text-muted mt-0.5">Enter the password to remove protection</p>
              </div>
            </Modal.Header>
            <Modal.Body>
              <InputGroup fullWidth variant="secondary">
                <InputGroup.Input
                  type="password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Enter password"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') onUnlock() }}
                />
              </InputGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={onClose}>Cancel</Button>
              <Button variant="primary" onPress={onUnlock} isPending={isProcessing}>
                {isProcessing ? 'Unlocking…' : 'Unlock & Download'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

interface PendingFileModalProps {
  isOpen: boolean
  isProcessing: boolean
  password: string
  error: string | null
  onPasswordChange: (password: string) => void
  onSubmit: () => void
  onBypass: () => void
  onClose: () => void
}

export function PendingFileModal({
  isOpen,
  isProcessing,
  password,
  error,
  onPasswordChange,
  onSubmit,
  onBypass,
  onClose,
}: PendingFileModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Icon className="bg-accent/10 text-accent">
                <IconShieldLock className="w-6 h-6" />
              </Modal.Icon>
              <div>
                <Modal.Heading>Password Required</Modal.Heading>
                <p className="text-sm text-muted mt-0.5">This PDF is encrypted. Enter the password to open it.</p>
              </div>
            </Modal.Header>
            <Modal.Body className="space-y-3">
              {error && <Alert status="danger">{error}</Alert>}
              <InputGroup fullWidth variant="secondary">
                <InputGroup.Input
                  type="password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Enter password"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') onSubmit() }}
                />
              </InputGroup>
            </Modal.Body>
            <Modal.Footer className="justify-between">
              <Button variant="ghost" onPress={onBypass} isDisabled={isProcessing} className="gap-1.5">
                <IconKey className="w-4 h-4" />
                Try Bypass
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onPress={onClose}>Cancel</Button>
                <Button variant="primary" onPress={onSubmit} isPending={isProcessing}>
                  {isProcessing ? 'Opening…' : 'Open PDF'}
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
