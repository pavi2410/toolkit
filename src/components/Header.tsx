import { Toolbar } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link } from '@tanstack/react-router'
import IconTools from '~icons/tabler/tools'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only left-4 top-3 z-50 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:absolute"
      >
        Skip to content
      </a>
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <IconTools className="h-4.5 w-4.5 text-accent" />
            <span className="font-display text-base font-semibold text-foreground">Toolkit</span>
          </Link>
        </div>

        <Toolbar aria-label="Site controls" className="flex items-center rounded-full border border-border/70 bg-surface/80 p-1 shadow-sm">
          <ThemeToggle />
        </Toolbar>
      </div>
    </header>
  )
}
