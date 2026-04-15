import { Tabs } from '@heroui/react'
import { startTransition, useCallback, useDeferredValue, useState } from 'react'
import IconFileHtml from '~icons/tabler/file-type-html'
import IconFileCss from '~icons/tabler/file-type-css'
import IconFileJs from '~icons/tabler/file-type-js'
import CodeEditor from './CodeEditor'
import ConsolePanel from './ConsolePanel'
import { fileDescriptors, initialFiles } from './constants'
import PreviewPanel from './PreviewPanel'
import type { ConsoleLog, FileContent, FileName } from './types'

const fileIcons: Record<FileName, typeof IconFileHtml> = {
  'index.html': IconFileHtml,
  'style.css': IconFileCss,
  'script.js': IconFileJs,
}

export default function DecoTool() {
  const [files, setFiles] = useState<FileContent>(() => initialFiles)
  const [activeFile, setActiveFile] = useState<FileName>('script.js')
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [persistLogs, setPersistLogs] = useState(false)

  const deferredFiles = useDeferredValue(files)

  const handleFileChange = useCallback(
    (value: string) => {
      setFiles((previous) => ({
        ...previous,
        [activeFile]: value,
      }))
    },
    [activeFile]
  )

  const handleConsoleLog = useCallback((log: ConsoleLog) => {
    startTransition(() => {
      setConsoleLogs((previous) => [...previous, log])
    })
  }, [])

  const handlePreviewRefresh = useCallback(() => {
    if (!persistLogs) {
      startTransition(() => {
        setConsoleLogs([])
      })
    }
  }, [persistLogs])

  const handleClearConsole = useCallback(() => {
    setConsoleLogs([])
  }, [])

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground">
      <div className="grid min-h-0 flex-1 grid-cols-[12rem_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_14rem] overflow-hidden">
        {/* Explorer */}
        <div className="row-span-2 flex min-h-0 flex-col overflow-hidden border-r border-border bg-surface">
          <div className="flex h-7 shrink-0 items-center border-b border-border px-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted">Files</span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto py-1">
            {fileDescriptors.map((descriptor) => {
              const isActive = descriptor.name === activeFile
              const Icon = fileIcons[descriptor.name]
              return (
                <button
                  key={descriptor.name}
                  type="button"
                  onClick={() => setActiveFile(descriptor.name)}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left font-mono text-[12px] ${
                    isActive
                      ? 'bg-surface-secondary text-foreground'
                      : 'text-muted hover:bg-surface-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{descriptor.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="flex min-h-0 flex-col overflow-hidden">
          <Tabs
            selectedKey={activeFile}
            onSelectionChange={(key) => setActiveFile(key as FileName)}
            className="flex min-h-0 flex-1 flex-col"
            variant="secondary"
          >
            <Tabs.List aria-label="Editor files" className="flex h-8 w-full justify-start border-b border-border bg-surface">
              {fileDescriptors.map(({ name }) => (
                <Tabs.Tab
                  key={name}
                  id={name}
                  className="flex w-auto grow-0 items-center gap-2 rounded-none border-r border-border px-4 py-2 font-mono text-[13px] text-muted"
                >
                  <span>{name}</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {fileDescriptors.map(({ name }) => (
              <Tabs.Panel key={name} id={name} className="min-h-0 flex-1">
                <CodeEditor value={files[name]} fileName={name} onChange={handleFileChange} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>

        {/* Bottom panels */}
        <section className="grid min-h-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-t border-border bg-surface-secondary">
          <ConsolePanel logs={consoleLogs} persistLogs={persistLogs} onPersistLogsChange={setPersistLogs} onClear={handleClearConsole} />
          <PreviewPanel
            files={deferredFiles}
            onConsoleLog={handleConsoleLog}
            onPreviewRefresh={handlePreviewRefresh}
          />
        </section>
      </div>
    </div>
  )
}
