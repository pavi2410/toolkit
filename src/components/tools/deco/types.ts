export interface FileContent {
  'index.html': string
  'script.js': string
  'style.css': string
}

export type FileName = keyof FileContent

export interface ConsoleLog {
  type: 'log' | 'error' | 'warn' | 'info'
  message: string
  timestamp: number
}

export interface FileDescriptor {
  name: FileName
  label: string
  detail: string
  chip: string
}