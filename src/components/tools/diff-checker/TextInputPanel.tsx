import { useRef, useEffect } from 'react'
import StatsWidget from './StatsWidget'

interface TextInputPanelProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  lineWrap: boolean
}

export default function TextInputPanel({
  label,
  value,
  onChange,
  placeholder,
  lineWrap
}: TextInputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  // Sync scroll between line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  // Determine white-space and overflow styles based on lineWrap
  const textareaClasses = lineWrap
    ? 'relative z-0 h-full w-full pl-15 pr-3 py-3 font-mono text-sm leading-5 border-none bg-transparent text-foreground resize-none focus:outline-none focus:ring-0 whitespace-pre-wrap wrap-break-word overflow-auto'
    : 'relative z-0 h-full w-full pl-15 pr-3 py-3 font-mono text-sm leading-5 border-none bg-transparent text-foreground resize-none focus:outline-none focus:ring-0 whitespace-pre overflow-auto'

  // Split text into actual lines for proper line number positioning
  const lines = value ? value.split('\n') : ['']

  return (
    <div className="flex flex-col border-r border-border last:border-r-0">
      {/* Header */}
      <div className="px-4 py-2 bg-surface-secondary border-b border-border flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-muted uppercase tracking-widest shrink-0">
          {label}
        </span>
        <StatsWidget text={value} />
      </div>

      {/* Editor with line numbers */}
      <div className="relative h-80 bg-surface">
        <div className="absolute inset-y-0 left-0 w-12 bg-surface-secondary border-r border-border pointer-events-none" />
        <div
          ref={lineNumbersRef}
          className="absolute inset-0 overflow-hidden select-none pointer-events-none z-10"
          style={{ overflowY: 'hidden' }}
        >
          <div className="py-3">
            {lines.map((line, index) => (
              <div key={index} className="relative">
                {/* Invisible text that wraps the same way as textarea */}
                <div
                  className={`pl-15 pr-3 font-mono text-sm leading-5 opacity-0 ${
                    lineWrap ? 'whitespace-pre-wrap wrap-break-word' : 'whitespace-pre'
                  }`}
                >
                  {line || '\n'}
                </div>
                {/* Line number overlay */}
                <div className="absolute top-0 left-0 w-12 pr-2 text-right font-mono text-xs leading-5 text-muted">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onScroll={handleScroll}
          className={textareaClasses}
          placeholder={placeholder}
          aria-label={label}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
