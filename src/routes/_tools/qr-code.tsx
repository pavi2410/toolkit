import { createFileRoute } from '@tanstack/react-router'
import QrCodeTool from '#/components/tools/qr-code'
import { seo } from '#/utils/seo'

export const Route = createFileRoute('/_tools/qr-code')({
  ssr: false,
  head: () =>
    seo({
      title: 'QR Code | Toolkit',
      description:
        'Generate QR codes for URLs, text, Wi-Fi, email, and phone numbers in your browser.',
      path: '/qr-code',
    }),
  component: QrCodeTool,
})
