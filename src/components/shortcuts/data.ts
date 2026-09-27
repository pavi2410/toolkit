/** `mod` renders as ⌘ on macOS and Ctrl elsewhere */
export type ShortcutKey = 'mod' | 'shift' | (string & {})

export interface Shortcut {
  label: string
  /** Alternative combos, each a list of keys pressed together */
  combos: ShortcutKey[][]
}

export interface ShortcutGroup {
  title: string
  items: Shortcut[]
}

const general: ShortcutGroup = {
  title: 'General',
  items: [{ label: 'Show keyboard shortcuts', combos: [['?']] }],
}

const editor: ShortcutGroup = {
  title: 'Editor',
  items: [
    { label: 'Undo', combos: [['mod', 'Z']] },
    { label: 'Redo', combos: [['mod', 'shift', 'Z']] },
    { label: 'Find', combos: [['mod', 'F']] },
    { label: 'Select next occurrence', combos: [['mod', 'D']] },
    { label: 'Select all', combos: [['mod', 'A']] },
  ],
}

const toolShortcuts: Record<string, ShortcutGroup[]> = {
  '/image-editor': [
    {
      title: 'Editing',
      items: [
        { label: 'Undo', combos: [['mod', 'Z']] },
        { label: 'Redo', combos: [['mod', 'shift', 'Z'], ['mod', 'Y']] },
        { label: 'Open export panel', combos: [['mod', 'S']] },
        { label: 'Paste image', combos: [['mod', 'V']] },
      ],
    },
    {
      title: 'View',
      items: [
        { label: 'Zoom in', combos: [['mod', '=']] },
        { label: 'Zoom out', combos: [['mod', '-']] },
        { label: 'Zoom with wheel', combos: [['mod', 'Scroll']] },
        { label: 'Actual size', combos: [['mod', '0']] },
        { label: 'Fit to screen', combos: [['shift', '1']] },
      ],
    },
  ],
  '/diff-checker': [editor],
  '/deco': [
    {
      ...editor,
      items: [
        ...editor.items,
        { label: 'Toggle comment', combos: [['mod', '/']] },
        { label: 'Indent / outdent', combos: [['Tab'], ['shift', 'Tab']] },
      ],
    },
  ],
}

export function getShortcuts(path: string | undefined): ShortcutGroup[] {
  return [...(path ? toolShortcuts[path] ?? [] : []), general]
}
