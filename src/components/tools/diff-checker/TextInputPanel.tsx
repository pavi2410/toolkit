import { useMemo } from 'react'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { useIsDarkTheme } from '@/hooks/useTheme'
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
  const isDarkTheme = useIsDarkTheme()

  const extensions = useMemo(
    () => [
      EditorView.theme({
        '&': {
          height: '100%',
          backgroundColor: 'var(--surface)',
          color: 'var(--foreground)',
          fontSize: '13px'
        },
        '.cm-scroller': {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
        },
        '.cm-content': {
          padding: '12px 0'
        },
        '.cm-line': {
          paddingLeft: '16px',
          paddingRight: '16px'
        },
        '.cm-gutters': {
          backgroundColor: 'var(--surface-secondary)',
          color: 'color-mix(in srgb, var(--muted) 92%, transparent)',
          borderRight: '1px solid var(--border)'
        },
        '.cm-activeLine, .cm-activeLineGutter': {
          backgroundColor: 'color-mix(in srgb, var(--accent) 7%, transparent)'
        },
        '&.cm-focused': {
          outline: 'none'
        },
        '&.cm-focused .cm-selectionBackground, ::selection': {
          backgroundColor: 'color-mix(in srgb, var(--accent) 22%, transparent)'
        }
      }),
      ...(lineWrap ? [EditorView.lineWrapping] : [])
    ],
    [lineWrap]
  )

  return (
    <div className="flex flex-col border-r border-border last:border-r-0">
      <div className="px-4 py-2 bg-surface-secondary border-b border-border flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-muted uppercase tracking-widest shrink-0">
          {label}
        </span>
        <StatsWidget text={value} />
      </div>

      <div className="h-80 min-h-0 overflow-hidden bg-surface [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto">
        <CodeMirror
          value={value}
          height="100%"
          theme={isDarkTheme ? oneDark : 'light'}
          extensions={extensions}
          onChange={onChange}
          placeholder={placeholder}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false
          }}
          aria-label={label}
        />
      </div>
    </div>
  )
}
