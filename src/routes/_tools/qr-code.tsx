import { createFileRoute } from '@tanstack/react-router'
import QrCodeTool from '#/components/tools/qr-code'

export const Route = createFileRoute('/_tools/qr-code')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'QR Code | Toolkit' },
      {
        name: 'description',
        content: 'Generate QR codes for URLs, text, Wi-Fi, email, and phone numbers in your browser.',
      },
    ],
  }),
  component: QrCodeTool,
})
