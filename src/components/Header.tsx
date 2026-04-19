import { Toolbar } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import IconTools from '~icons/tabler/tools'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-transparent px-3 pt-3 pb-2 sm:px-4">
      <a
        href="#main-content"
        className="sr-only left-4 top-2.5 z-50 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:absolute"
      >
        Skip to content
      </a>
      <div className="flex w-full items-center justify-between gap-3">
        <Toolbar isAttached aria-label="Site branding" className="shrink-0">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <IconTools className="h-4.5 w-4.5 text-accent" />
            <span className="font-display text-base font-semibold text-foreground">Toolkit</span>
          </Link>
        </Toolbar>

        <Toolbar isAttached aria-label="Site controls" className="shrink-0">
          <ThemeToggle />
        </Toolbar>
      </div>
    </header>
  )
}
