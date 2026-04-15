import { Button, Checkbox } from '@heroui/react'
import type { ConsoleLog } from './types'

interface ConsolePanelProps {
  logs: ConsoleLog[]
  persistLogs: boolean
  onPersistLogsChange: (value: boolean) => void
  onClear: () => void
}

const toneClasses: Record<ConsoleLog['type'], string> = {
  log: 'text-foreground',
  info: 'text-accent',
  warn: 'text-warning',
  error: 'text-danger',
}

export default function ConsolePanel({ logs, persistLogs, onPersistLogsChange, onClear }: ConsolePanelProps) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden border-r border-border">
      <div className="flex h-7 shrink-0 items-center justify-between border-b border-border bg-surface px-3">
        <span className="text-xs font-medium text-muted">Console</span>
        <div className="flex items-center gap-3">
          <Checkbox size="sm" isSelected={persistLogs} onValueChange={onPersistLogsChange}>
            <span className="text-[11px] text-muted">Persist logs</span>
          </Checkbox>
          <button
            type="button"
            onClick={onClear}
            disabled={logs.length === 0}
            className="text-[11px] text-muted hover:text-foreground disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-surface-secondary p-0 font-mono text-[12px] leading-6">
        {logs.length === 0 ? (
          <div className="px-3 py-2 text-muted">
            &gt;
          </div>
        ) : (
          <div>
            {logs.map((log) => (
              <div
                key={`${log.timestamp}-${log.message}`}
                className={`border-b border-border px-3 py-1 whitespace-pre-wrap wrap-break-word ${toneClasses[log.type]}`}
              >
                {log.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}