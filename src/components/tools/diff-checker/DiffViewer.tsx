import { useMemo } from 'react'
import { EditorView, placeholder } from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import CodeMirrorMerge from 'react-codemirror-merge'
import { useIsDarkTheme } from '@/hooks/useTheme'
import StatsWidget from './StatsWidget'

interface DiffViewerProps {
  originalText: string
  modifiedText: string
  lineWrap: boolean
  onOriginalChange: (value: string) => void
  onModifiedChange: (value: string) => void
}

const OriginalEditor = CodeMirrorMerge.Original
const ModifiedEditor = CodeMirrorMerge.Modified

export default function DiffViewer({
  originalText,
  modifiedText,
  lineWrap,
  onOriginalChange,
  onModifiedChange
}: DiffViewerProps) {
  const isDarkTheme = useIsDarkTheme()

  const baseExtensions = useMemo(
    () => [
      EditorView.theme({
        '&': {
          height: '100%',
          backgroundColor: 'var(--surface)',
          color: 'var(--foreground)',
          fontSize: '13px'
        },
        '.cm-scroller': {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          lineHeight: '1.55'
        },
        '.cm-content': {
          padding: '8px 0 16px'
        },
        '.cm-line': {
          paddingLeft: '16px',
          paddingRight: '16px'
        },
        '.cm-gutters': {
          backgroundColor: 'var(--surface-secondary)',
          borderRight: '1px solid var(--border)',
          color: 'var(--muted)'
        },
        '.cm-activeLine, .cm-activeLineGutter': {
          backgroundColor: 'transparent'
        },
        '.cm-merge-b .cm-changedLine, .cm-inlineChangedLine': {
          backgroundColor: 'color-mix(in srgb, var(--success) 12%, transparent)'
        },
        '.cm-deletedChunk, .cm-merge-a .cm-changedLine': {
          backgroundColor: 'color-mix(in srgb, var(--danger) 10%, transparent)'
        },
        '.cm-changedText': {
          borderRadius: '0.25rem'
        },
        '.cm-merge-b .cm-changedText, .cm-insertedLine': {
          backgroundColor: 'color-mix(in srgb, var(--success) 22%, transparent)',
          textDecoration: 'none'
        },
        '.cm-deletedChunk .cm-deletedText, .cm-deletedLine, .cm-deletedLine del': {
          backgroundColor: 'color-mix(in srgb, var(--danger) 18%, transparent)',
          textDecoration: 'none'
        },
        '.cm-deletedChunk': {
          borderTop: '1px solid color-mix(in srgb, var(--danger) 18%, transparent)',
          borderBottom: '1px solid color-mix(in srgb, var(--danger) 18%, transparent)'
        },
        '.cm-changedLineGutter, .cm-deletedLineGutter': {
          minWidth: '4px'
        },
        '&.cm-focused': {
          outline: 'none'
        }
      }),
      ...(lineWrap ? [EditorView.lineWrapping] : [])
    ],
    [lineWrap]
  )

  const originalExtensions = useMemo(
    () => [...baseExtensions, placeholder('Paste original text here…')],
    [baseExtensions]
  )

  const modifiedExtensions = useMemo(
    () => [...baseExtensions, placeholder('Paste modified text here…')],
    [baseExtensions]
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden border-t border-border">
      <div className="grid shrink-0 grid-cols-1 border-b border-border bg-surface md:grid-cols-2">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-2 md:border-b-0 md:border-r">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Text A (Original)
          </span>
          <StatsWidget text={originalText} />
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Text B (Modified)
          </span>
          <StatsWidget text={modifiedText} />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden bg-surface [&_.cm-mergeView]:h-full [&_.cm-mergeView]:bg-transparent [&_.cm-mergeViewEditors]:h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto [&_.cm-merge-revert]:hidden">
        <CodeMirrorMerge
          className="h-full"
          orientation="a-b"
          revertControls="a-to-b"
          gutter
          highlightChanges
          collapseUnchanged={{ margin: 3, minSize: 4 }}
          theme={isDarkTheme ? oneDark : 'light'}
          destroyRerender={false}
        >
          <OriginalEditor
            value={originalText}
            onChange={(value) => onOriginalChange(value)}
            extensions={originalExtensions}
            editable
            readOnly={false}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false
            }}
          />
          <ModifiedEditor
            value={modifiedText}
            onChange={(value) => onModifiedChange(value)}
            extensions={modifiedExtensions}
            editable
            readOnly={false}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
              foldGutter: false,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: false
            }}
          />
        </CodeMirrorMerge>
      </div>
    </div>
  )
}
