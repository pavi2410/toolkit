import { useCallback, useMemo, useState } from 'react'
import { Surface } from '@heroui/react'
import type { QrCodeGenerateResult } from 'uqr'
import Form from './Form'
import Preview from './Preview'
import Toolbar from './Toolbar'
import { buildPayload, exampleContent } from './payload'
import { downloadBlob, encodeQr, qrPngBlob, qrSvg } from './qr'
import { DEFAULT_CONTENT, DEFAULT_STYLE, type QrContent, type QrStyle } from './types'

export default function QrCodeTool() {
  const [content, setContent] = useState<QrContent>(DEFAULT_CONTENT)
  const [style, setStyle] = useState<QrStyle>(DEFAULT_STYLE)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const payload = useMemo(() => buildPayload(content), [content])
  const bytes = useMemo(() => new TextEncoder().encode(payload).length, [payload])

  const encoded = useMemo(() => {
    if (!payload) return { qr: null, error: null } as const
    try {
      return { qr: encodeQr(payload, style.ecc, style.border), error: null } as const
    } catch {
      return { qr: null, error: 'Shorten the content or lower the error-correction level.' } as const
    }
  }, [payload, style.ecc, style.border])

  const handleLoadExample = useCallback(() => {
    setContent((prev) => ({ ...prev, ...exampleContent(prev.kind) }))
  }, [])

  const handleInvert = useCallback(() => {
    setStyle((prev) => ({ ...prev, fg: prev.bg, bg: prev.fg }))
  }, [])

  const withQr = useCallback(async (run: (qr: QrCodeGenerateResult) => Promise<void> | void) => {
    if (!encoded.qr || !payload) return
    await run(encoded.qr)
  }, [encoded.qr, payload])

  const handleDownloadPng = useCallback(() => {
    void withQr(async (qr) => {
      const blob = await qrPngBlob(qr, style.fg, style.bg, style.size)
      downloadBlob(blob, 'qr-code.png')
    })
  }, [withQr, style.fg, style.bg, style.size])

  const handleDownloadSvg = useCallback(() => {
    if (!payload) return
    const svg = qrSvg(payload, style.ecc, style.border, style.fg, style.bg)
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qr-code.svg')
  }, [payload, style])

  const handleCopy = useCallback(() => {
    void withQr(async (qr) => {
      try {
        const blob = await qrPngBlob(qr, style.fg, style.bg, style.size)
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopyState('copied')
      } catch {
        setCopyState('failed')
      }
      window.setTimeout(() => setCopyState('idle'), 2000)
    })
  }, [withQr, style.fg, style.bg, style.size])

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-surface-secondary">
      <Toolbar
        canExport={Boolean(encoded.qr)}
        copyState={copyState}
        onLoadExample={handleLoadExample}
        onInvert={handleInvert}
        onCopy={handleCopy}
        onDownloadPng={handleDownloadPng}
        onDownloadSvg={handleDownloadSvg}
      />

      <div className="grid min-h-0 flex-1 overflow-auto lg:grid-cols-[22rem_minmax(0,1fr)] lg:overflow-hidden">
        <Surface variant="default" className="order-2 min-h-0 rounded-none shadow-none lg:order-none lg:border-r lg:border-border">
          <Form content={content} style={style} onContentChange={setContent} onStyleChange={setStyle} />
        </Surface>
        <div className="order-1 flex min-h-[28rem] flex-col lg:order-none lg:min-h-0">
          <Preview
            qr={encoded.qr}
            error={encoded.error}
            fg={style.fg}
            bg={style.bg}
            ecc={style.ecc}
            exportSize={style.size}
            bytes={bytes}
          />
        </div>
      </div>
    </div>
  )
}
