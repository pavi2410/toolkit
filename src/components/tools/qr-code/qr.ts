import { encode, renderSVG, type QrCodeGenerateResult } from 'uqr'
import type { EccLevel } from './types'

export function encodeQr(payload: string, ecc: EccLevel, border: number): QrCodeGenerateResult {
  return encode(payload, { ecc, border, boostEcc: false })
}

export function qrSvg(payload: string, ecc: EccLevel, border: number, fg: string, bg: string) {
  return renderSVG(payload, {
    ecc,
    border,
    boostEcc: false,
    pixelSize: 10,
    blackColor: fg,
    whiteColor: bg,
  })
}

export function modulePx(size: number, modules: number) {
  return Math.max(1, Math.round(size / modules))
}

export function qrPngBlob(qr: QrCodeGenerateResult, fg: string, bg: string, size: number) {
  const scale = modulePx(size, qr.size)
  const dim = qr.size * scale
  const canvas = document.createElement('canvas')
  canvas.width = dim
  canvas.height = dim
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('Canvas unavailable'))

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, dim, dim)
  ctx.fillStyle = fg
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.data[y][x]) ctx.fillRect(x * scale, y * scale, scale, scale)
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))), 'image/png')
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
