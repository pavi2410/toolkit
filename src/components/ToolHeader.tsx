import { Separator, Toolbar } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link } from '@tanstack/react-router'
import IconArrowLeft from '~icons/tabler/arrow-left'
import ThemeToggle from './ThemeToggle'

interface ToolHeaderProps {
  title: string
}

export default function ToolHeader({ title }: ToolHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <a
        href="#main-content"
        className="sr-only left-4 top-3 z-50 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:absolute"
      >
        Skip to content
      </a>
      <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className={`${buttonVariants({ variant: 'tertiary', size: 'sm' })} shrink-0 whitespace-nowrap`}
          >
            <IconArrowLeft className="h-4 w-4" />
            All Tools
          </Link>

          <Separator orientation="vertical" className="hidden h-5 sm:block" />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">
              {title}
            </p>
          </div>
        </div>

        <Toolbar aria-label="Tool page settings" className="rounded-full border border-border/70 bg-surface/80 p-1 shadow-sm">
          <ThemeToggle />
        </Toolbar>
      </div>
    </header>
  )
}