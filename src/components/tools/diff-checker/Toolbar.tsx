import type { DiffStrategy } from '@/utils/diff'
import { Button, ButtonGroup, Checkbox, Label, Separator, Toolbar as HuiToolbar } from '@heroui/react'

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
  canCopy: boolean
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
  canCopy
}: ToolbarProps) {
  return (
    <div className="shrink-0 border-b border-border bg-surface-secondary px-4 py-2.5">
      <HuiToolbar aria-label="Diff options" className="flex flex-wrap gap-x-6 gap-y-2 items-center text-sm">
        {/* Strategy Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted uppercase tracking-wide">
            Diff Mode:
          </span>
          <ButtonGroup variant="secondary">
            {(['line', 'word', 'char'] as const).map(s => (
              <Button
                key={s}
                size="sm"
                variant={strategy === s ? 'primary' : 'secondary'}
                onPress={() => onStrategyChange(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <Separator orientation="vertical" className="h-5" />

        {/* Options */}
        <div className="flex gap-4">
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <ButtonGroup variant="secondary">
          <Button size="sm" variant="secondary" onPress={onSwap}>
            ⇄ Swap
          </Button>
          <Button size="sm" variant="secondary" isDisabled={!canCopy} onPress={onCopyDiff}>
            {copySuccess ? '✓ Copied' : 'Copy Diff'}
          </Button>
        </ButtonGroup>
      </HuiToolbar>
    </div>
  )
}
