import IconFileCss from '~icons/tabler/file-type-css'
import IconFileHtml from '~icons/tabler/file-type-html'
import IconFileJs from '~icons/tabler/file-type-js'
import type { FileName } from './types'

export const fileIcons: Record<FileName, typeof IconFileHtml> = {
  'index.html': IconFileHtml,
  'style.css': IconFileCss,
  'script.js': IconFileJs,
}
