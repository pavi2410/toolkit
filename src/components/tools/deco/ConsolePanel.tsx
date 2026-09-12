import { Button, Chip, Switch, Tooltip } from '@heroui/react'
import IconAlertTriangle from '~icons/tabler/alert-triangle'
import IconCircleX from '~icons/tabler/circle-x'
import IconInfoCircle from '~icons/tabler/info-circle'
import IconTerminal from '~icons/tabler/terminal-2'
import IconTrash from '~icons/tabler/trash'
import PanelHeader from './PanelHeader'
import type { ConsoleLog } from './types'

interface ConsolePanelProps {
  logs: ConsoleLog[]
  persistLogs: boolean
  onPersistLogsChange: (value: boolean) => void
  onClear: () => void
}

const tone: Record<ConsoleLog['type'], { row: string; icon: typeof IconInfoCircle | null }> = {
  log: { row: 'text-foreground', icon: null },
  info: { row: 'text-accent', icon: IconInfoCircle },
  warn: { row: 'text-warning bg-warning/5', icon: IconAlertTriangle },
  error: { row: 'text-danger bg-danger/5', icon: IconCircleX },
}

export default function ConsolePanel({ logs, persistLogs, onPersistLogsChange, onClear }: ConsolePanelProps) {
  const errorCount = logs.filter((log) => log.type === 'error').length

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface">
      <PanelHeader title="Console" icon={IconTerminal}>
        {logs.length > 0 && (
          <Chip size="sm" variant="soft" color={errorCount > 0 ? 'danger' : 'default'} className="mr-1">
            <Chip.Label>{errorCount > 0 ? `${errorCount} error${errorCount > 1 ? 's' : ''}` : logs.length}</Chip.Label>
          </Chip>
        )}

        <Switch size="sm" isSelected={persistLogs} onChange={onPersistLogsChange} className="mr-1 gap-1.5">
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Content className="text-[11px] text-muted">Persist</Switch.Content>
        </Switch>

        <Tooltip delay={300}>
          <Button isIconOnly size="sm" variant="ghost" isDisabled={logs.length === 0} onPress={onClear} aria-label="Clear console">
            <IconTrash className="h-4 w-4" />
          </Button>
          <Tooltip.Content>Clear console</Tooltip.Content>
        </Tooltip>
      </PanelHeader>

      <div className="min-h-0 flex-1 overflow-auto font-mono text-xs leading-5">
        {logs.length === 0 ? (
          <p className="px-3 py-2 text-muted">
            <span className="mr-2 text-accent">›</span>
            Output from the preview appears here
          </p>
        ) : (
          logs.map((log) => {
            const { row, icon: Icon } = tone[log.type]
            return (
              <div
                key={`${log.timestamp}-${log.message}`}
                className={`flex items-start gap-2 border-b border-border/60 px-3 py-1 whitespace-pre-wrap wrap-break-word ${row}`}
              >
                <span className="flex h-5 w-3.5 shrink-0 items-center justify-center">
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : <span className="text-muted">›</span>}
                </span>
                <span className="min-w-0 flex-1">{log.message}</span>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
