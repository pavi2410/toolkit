import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import type { ConsoleLog, FileContent } from './types'

interface PreviewPanelProps {
  files: FileContent
  onConsoleLog: (log: ConsoleLog) => void
  onPreviewRefresh: () => void
}

export default function PreviewPanel({ files, onConsoleLog, onPreviewRefresh }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [isListening, setIsListening] = useState(false)
  const channel = 'toolkit-deco-preview'

  const srcDoc = useMemo(() => {
    const { 'index.html': html, 'style.css': styles, 'script.js': script } = files

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${styles}</style>
  </head>
  <body>
    ${html}
    <script>
      (function consoleBridge() {
        function send(payload) {
          window.parent.postMessage({ channel: '${channel}', ...payload }, '*')
        }

        const originalConsole = {
          log: console.log,
          info: console.info,
          warn: console.warn,
          error: console.error,
        }

        for (const method of ['log', 'info', 'warn', 'error']) {
          console[method] = function (...args) {
            originalConsole[method].apply(console, args)

            const message = args
              .map((arg) => {
                if (typeof arg === 'string') {
                  return arg
                }

                try {
                  return JSON.stringify(arg, null, 2)
                } catch {
                  return String(arg)
                }
              })
              .join(' ')

            send({ type: 'console', method, message })
          }
        }

        window.onerror = function (message) {
          send({ type: 'console', method: 'error', message: 'Error: ' + message })
          return false
        }

        send({ type: 'clear-console' })
      })()
    </script>
    <script>
      (function runUserCode() {
        ${script}
      })()
    </script>
  </body>
</html>`
  }, [files])

  const handleMessage = useEffectEvent((event: MessageEvent) => {
    if (typeof event.data !== 'object' || event.data === null) {
      return
    }

    if (event.data.channel !== channel) {
      return
    }

    if (event.data.type === 'console') {
      onConsoleLog({
        type: event.data.method,
        message: event.data.message,
        timestamp: Date.now(),
      })
      return
    }

    if (event.data.type === 'clear-console') {
      onPreviewRefresh()
    }
  })

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    setIsListening(true)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <div className="flex h-7 shrink-0 items-center border-b border-border bg-surface px-3">
        <span className="text-xs font-medium text-muted">Web View</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          title="Deco preview"
          srcDoc={isListening ? srcDoc : ''}
          sandbox="allow-scripts"
          className="h-full w-full border-0 bg-white"
        />
      </div>
    </div>
  )
}