import { Chip, Surface } from '@heroui/react'
import type { QrCodeGenerateResult } from 'uqr'
import IconQrcode from '~icons/tabler/qrcode'
import { modulePx } from './qr'
import type { EccLevel } from './types'

interface PreviewProps {
  qr: QrCodeGenerateResult | null
  error: string | null
  fg: string
  bg: string
  ecc: EccLevel
  exportSize: number
  bytes: number
}

export default function Preview({ qr, error, fg, bg, ecc, exportSize, bytes }: PreviewProps) {
  if (error) {
    return (
      <Empty
        title="Too much data"
        description={error}
      />
    )
  }

  if (!qr) {
    return (
      <Empty
        title="Add some content"
        description="Type a URL, message, or Wi‑Fi details and the QR code appears here."
      />
    )
  }

  const dim = qr.size * modulePx(exportSize, qr.size)
  const path = modulesPath(qr.data)

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-4 lg:p-6">
      <Surface className="rounded-3xl p-5 shadow-none">
        <svg
          viewBox={`0 0 ${qr.size} ${qr.size}`}
          className="h-[min(22rem,70vw)] w-[min(22rem,70vw)]"
          shapeRendering="crispEdges"
          role="img"
          aria-label="Generated QR code"
        >
          <rect width={qr.size} height={qr.size} fill={bg} />
          <path d={path} fill={fg} />
        </svg>
      </Surface>

      <div className="flex flex-wrap justify-center gap-2">
        <Chip color="default" variant="soft" size="sm">
          <Chip.Label>Version {qr.version}</Chip.Label>
        </Chip>
        <Chip color="default" variant="soft" size="sm">
          <Chip.Label>{dim}×{dim} px</Chip.Label>
        </Chip>
        <Chip color="default" variant="soft" size="sm">
          <Chip.Label>ECC {ecc}</Chip.Label>
        </Chip>
        <Chip color="default" variant="soft" size="sm">
          <Chip.Label>{bytes} bytes</Chip.Label>
        </Chip>
      </div>
    </div>
  )
}

function modulesPath(data: boolean[][]) {
  const parts: string[] = []
  for (let y = 0; y < data.length; y++) {
    const row = data[y]
    for (let x = 0; x < row.length; x++) {
      if (row[x]) parts.push(`M${x} ${y}h1v1h-1z`)
    }
  }
  return parts.join('')
}

function Empty({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-6">
      <div className="max-w-sm space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-default text-muted">
          <IconQrcode className="h-7 w-7" />
        </div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
    </div>
  )
}
