import { Chip } from '@heroui/react'
import type { QrCodeGenerateResult } from 'uqr'
import { modulePx } from './qr'
import type { EccLevel } from './types'

interface StatusBarProps {
  qr: QrCodeGenerateResult | null
  ecc: EccLevel
  exportSize: number
  bytes: number
}

export default function StatusBar({ qr, ecc, exportSize, bytes }: StatusBarProps) {
  const dim = qr ? qr.size * modulePx(exportSize, qr.size) : null

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-border bg-surface-secondary px-3 py-2 text-xs sm:px-4">
      <Chip size="sm" variant="soft">{bytes} bytes</Chip>
      <Chip size="sm" variant="soft">ECC {ecc}</Chip>
      {qr && dim && (
        <>
          <Chip size="sm" variant="soft">Version {qr.version}</Chip>
          <Chip size="sm" variant="soft">{dim}×{dim} px</Chip>
        </>
      )}
    </div>
  )
}
