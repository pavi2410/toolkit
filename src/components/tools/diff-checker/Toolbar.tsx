import type { DiffStrategy } from '@/utils/diff'
import { Button, Checkbox, Label, Separator, ToggleButton, ToggleButtonGroup, Toolbar as HuiToolbar } from '@heroui/react'

interface ToolbarProps {
  strategy: DiffStrategy
  onStrategyChange: (strategy: DiffStrategy) => void
  ignoreCase: boolean
  onIgnoreCaseChange: (value: boolean) => void
  ignoreWhitespace: boolean
  onIgnoreWhitespaceChange: (value: boolean) => void
  showWhitespace: boolean
  onShowWhitespaceChange: (value: boolean) => void
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
}

export default function Toolbar({
  strategy,
  onStrategyChange,
  ignoreCase,
  onIgnoreCaseChange,
  ignoreWhitespace,
  onIgnoreWhitespaceChange,
  showWhitespace,
  onShowWhitespaceChange,
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
}: ToolbarProps) {
  return (
    <div className="shrink-0 border-b border-border bg-surface px-4 py-2.5">
      <HuiToolbar aria-label="Diff options" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onPress={onLoadExample}>
            Load Example
          </Button>
          <Button size="sm" variant="ghost" onPress={onClear} isDisabled={!canClear}>
            Clear
          </Button>
        </div>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted uppercase tracking-wide">
            Diff Mode:
          </span>
          <ToggleButtonGroup
            disallowEmptySelection
            selectedKeys={new Set([strategy])}
            selectionMode="single"
            size="sm"
            onSelectionChange={(keys) => {
              const nextStrategy = Array.from(keys)[0]
              if (typeof nextStrategy === 'string') {
                onStrategyChange(nextStrategy as DiffStrategy)
              }
            }}
          >
            {(['line', 'word', 'char'] as const).map(s => (
              <ToggleButton
                key={s}
                id={s}
              >
                {s !== 'line' ? <ToggleButtonGroup.Separator /> : null}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <Separator orientation="vertical" className="h-5" />

        <div className="flex flex-wrap gap-4">
          <Checkbox isSelected={ignoreCase} onChange={v => onIgnoreCaseChange(v)}>
            <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
            <Checkbox.Content><Label className="text-xs">Ignore Case</Label></Checkbox.Content>
          </Checkbox>

          <Checkbox isSelected={ignoreWhitespace} onChange={v => onIgnoreWhitespaceChange(v)}>
            <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
            <Checkbox.Content><Label className="text-xs">Ignore Whitespace</Label></Checkbox.Content>
          </Checkbox>

          <Checkbox isSelected={showWhitespace} onChange={v => onShowWhitespaceChange(v)}>
            <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
            <Checkbox.Content><Label className="text-xs">Show Whitespace</Label></Checkbox.Content>
          </Checkbox>

          <Checkbox isSelected={lineWrap} onChange={v => onLineWrapChange(v)}>
            <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
            <Checkbox.Content><Label className="text-xs">Line Wrap</Label></Checkbox.Content>
          </Checkbox>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onPress={onSwap}>
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
