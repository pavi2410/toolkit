import { Button, Tabs } from '@heroui/react'
import { startTransition, useCallback, useDeferredValue, useState } from 'react'
import IconRestore from '~icons/tabler/restore'
import CodeEditor from './CodeEditor'
import ConsolePanel from './ConsolePanel'
import { fileDescriptors, initialFiles } from './constants'
import FileExplorer from './FileExplorer'
import { fileIcons } from './icons'
import PreviewPanel from './PreviewPanel'
import type { ConsoleLog, FileContent, FileName } from './types'

export default function DecoTool() {
  const [files, setFiles] = useState<FileContent>(() => initialFiles)
  const [activeFile, setActiveFile] = useState<FileName>('script.js')
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [persistLogs, setPersistLogs] = useState(false)
  const [runId, setRunId] = useState(0)

  const deferredFiles = useDeferredValue(files)

  const handleFileChange = useCallback(
    (value: string) => {
      setFiles((previous) => ({ ...previous, [activeFile]: value }))
    },
    [activeFile]
  )

  const handleReset = useCallback(() => {
    setFiles(initialFiles)
    setConsoleLogs([])
  }, [])

  const handleRun = useCallback(() => setRunId((id) => id + 1), [])

  const handleConsoleLog = useCallback((log: ConsoleLog) => {
    startTransition(() => {
      setConsoleLogs((previous) => [...previous, log])
    })
  }, [])

  const handlePreviewRefresh = useCallback(() => {
    if (!persistLogs) {
      startTransition(() => setConsoleLogs([]))
    }
  }, [persistLogs])

  const handleClearConsole = useCallback(() => setConsoleLogs([]), [])

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 grid-rows-2 overflow-hidden bg-surface-secondary text-foreground md:grid-cols-2 md:grid-rows-1 lg:grid-cols-[11rem_minmax(0,1fr)_clamp(20rem,36%,40rem)]">
      <FileExplorer activeFile={activeFile} onSelect={setActiveFile} onReset={handleReset} />

      <Tabs
        selectedKey={activeFile}
        onSelectionChange={(key) => setActiveFile(key as FileName)}
        variant="secondary"
        className="flex min-h-0 flex-col overflow-hidden border-b border-border md:border-r md:border-b-0"
      >
        <div className="flex h-9 shrink-0 items-center border-b border-border bg-surface">
          <Tabs.List aria-label="Editor files" className="h-full min-w-0 flex-1 justify-start gap-0 overflow-x-auto rounded-none bg-transparent p-0">
            {fileDescriptors.map(({ name }) => {
              const Icon = fileIcons[name]
              return (
                <Tabs.Tab
                  key={name}
                  id={name}
                  className="h-full w-auto shrink-0 grow-0 gap-2 whitespace-nowrap rounded-none border-r border-border px-3 font-mono text-xs data-[selected=true]:bg-surface-secondary"
                >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                  <Tabs.Indicator className="bottom-0 h-0.5 rounded-none" />
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
          <Button isIconOnly size="sm" variant="ghost" onPress={handleReset} aria-label="Reset to example" className="mx-1 shrink-0 lg:hidden">
            <IconRestore className="h-4 w-4" />
          </Button>
        </div>

        {fileDescriptors.map(({ name }) => (
          <Tabs.Panel key={name} id={name} className="min-h-0 flex-1">
            <CodeEditor value={files[name]} fileName={name} onChange={handleFileChange} />
          </Tabs.Panel>
        ))}
      </Tabs>

      <aside className="flex min-h-0 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-[3] flex-col">
          <PreviewPanel
            files={deferredFiles}
            runId={runId}
            onRun={handleRun}
            onConsoleLog={handleConsoleLog}
            onPreviewRefresh={handlePreviewRefresh}
          />
        </div>
        <div className="flex min-h-0 flex-[2] flex-col border-t border-border">
          <ConsolePanel
            logs={consoleLogs}
            persistLogs={persistLogs}
            onPersistLogsChange={setPersistLogs}
            onClear={handleClearConsole}
          />
        </div>
      </aside>
    </div>
  )
}
