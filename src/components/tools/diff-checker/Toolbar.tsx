import { Button, Checkbox, Label, Separator, Toolbar as HuiToolbar } from '@heroui/react'

interface ToolbarProps {
  lineWrap: boolean
  onLineWrapChange: (value: boolean) => void
  onSwap: () => void
  onCopyDiff: () => void
  copySuccess: boolean
  copyError: boolean
  canCopy: boolean
  onLoadExample: () => void
  onClear: () => void
  canClear: boolean
  additions: number
  deletions: number
}

export default function Toolbar({
  lineWrap,
  onLineWrapChange,
  onSwap,
  onCopyDiff,
  copySuccess,
  copyError,
  canCopy,
  onLoadExample,
  onClear,
  canClear,
  additions,
  deletions,
}: ToolbarProps) {
  return (
    <div className="shrink-0 border-b border-border bg-surface px-4 py-2">
      <HuiToolbar aria-label="Diff options" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onPress={onLoadExample}>
            Load Example
          </Button>
          {canClear && (
            <Button size="sm" variant="ghost" onPress={onClear}>
              Clear
            </Button>
          )}
        </div>

        {(additions > 0 || deletions > 0) && <Separator orientation="vertical" className="h-4" />}

        {(additions > 0 || deletions > 0) && (
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
            {additions > 0 && <span className="text-success">+{additions}</span>}
            {deletions > 0 && <span className="text-danger">-{deletions}</span>}
          </div>
        )}

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-4">
          <Checkbox isSelected={lineWrap} onChange={v => onLineWrapChange(v)}>
            <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
            <Checkbox.Content><Label className="text-xs">Line Wrap</Label></Checkbox.Content>
          </Checkbox>

          <Button size="sm" variant="ghost" onPress={onSwap}>
            ⇄ Swap
          </Button>
          <Button size="sm" variant={copyError ? 'danger' : 'secondary'} isDisabled={!canCopy} onPress={onCopyDiff}>
            {copySuccess ? '✓ Copied' : copyError ? 'Copy failed' : 'Copy Diff'}
          </Button>
        </div>
      </HuiToolbar>
    </div>
  )
}
