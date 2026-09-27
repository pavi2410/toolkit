import { Surface } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import IconCode from '~icons/tabler/code'
import IconFileTypePdf from '~icons/tabler/file-type-pdf'
import IconGitCompare from '~icons/tabler/git-compare'
import IconPhoto from '~icons/tabler/photo'
import IconQrcode from '~icons/tabler/qrcode'
import IconTag from '~icons/tabler/tag'

export const toolItems = [
  {
    name: 'Diff Checker',
    description: 'Compare text differences with line, word, or character-level strategies.',
    to: '/diff-checker',
    Icon: IconGitCompare,
  },
  {
    name: 'Image Editor',
    description: 'Resize, crop, and convert images fully in your browser.',
    to: '/image-editor',
    Icon: IconPhoto,
  },
  {
    name: 'Deco',
    description: 'Edit HTML, CSS, and JavaScript together with a live browser preview.',
    to: '/deco',
    Icon: IconCode,
  },
  {
    name: 'PDF Editor',
    description: 'Merge, split, rotate, reorder, and unlock PDFs in-browser.',
    to: '/pdf-editor',
    Icon: IconFileTypePdf,
  },
  {
    name: 'Name Checker',
    description: 'Check project-name availability across platforms and domains.',
    to: '/name-checker',
    Icon: IconTag,
  },
  {
    name: 'QR Code',
    description: 'Generate QR codes for URLs, text, Wi-Fi, email, and phone numbers.',
    to: '/qr-code',
    Icon: IconQrcode,
  },
] as const

export function getToolByPath(pathname: string) {
  return toolItems.find(({ to }) => pathname === to || pathname.startsWith(`${to}/`))
}

export function ToolDirectory() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {toolItems.map(({ name, description, to, Icon }) => (
        <Link key={to} to={to} className="group block rounded-3xl no-underline">
          <Surface className="h-full space-y-3 rounded-3xl p-5 transition-shadow group-hover:ring-2 group-hover:ring-accent-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-secondary">
              <Icon aria-hidden="true" className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="text-base font-semibold text-foreground">{name}</h2>
            <p className="text-sm text-muted">{description}</p>
          </Surface>
        </Link>
      ))}
    </div>
  )
}
