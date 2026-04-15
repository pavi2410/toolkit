import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import CodeMirror from '@uiw/react-codemirror'
import { useMemo } from 'react'
import { useIsDarkTheme } from '../../../hooks/useTheme'
import type { FileName } from './types'

interface CodeEditorProps {
  value: string
  fileName: FileName
  onChange: (value: string) => void
}

export default function CodeEditor({ value, fileName, onChange }: CodeEditorProps) {
  const isDarkTheme = useIsDarkTheme()

  const extensions = useMemo(() => {
    if (fileName === 'script.js') {
      return [javascript({ jsx: false })]
    }

    if (fileName === 'index.html') {
      return [html()]
    }

    return [css()]
  }, [fileName])

  return (
    <div className="h-full overflow-hidden bg-surface text-foreground">
      <CodeMirror
        value={value}
        height="100%"
        theme={isDarkTheme ? oneDark : 'light'}
        extensions={extensions}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
        }}
      />
    </div>
  )
}