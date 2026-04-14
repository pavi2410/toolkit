import { Modal } from '@heroui/react'

interface PreviewModalProps {
  url: string | null
  onClose: () => void
}

export function PreviewModal({ url, onClose }: PreviewModalProps) {
  return (
    <Modal isOpen={!!url} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable variant="blur" />
      <Modal.Container size="full" className="m-4 max-w-5xl max-h-[90vh]">
        <Modal.Dialog className="h-full">
          <Modal.CloseTrigger />
          <Modal.Body className="p-0 h-full">
            {url && (
              <iframe
                src={url}
                className="w-full h-full rounded-lg bg-white"
                title="PDF Preview"
              />
            )}
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  )
}
