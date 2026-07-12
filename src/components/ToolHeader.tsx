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
    <header className="sticky top-0 z-40 bg-transparent px-3 pt-3 pb-2 sm:px-4">
      <a
        href="#main-content"
        className="sr-only left-4 top-2.5 z-50 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:absolute"
      >
        Skip to content
      </a>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Toolbar
            isAttached
            aria-label="Tool navigation"
            className="flex w-max max-w-full min-w-0 items-center gap-2 pl-3 pr-[1.375rem] sm:gap-3"
          >
            <Link
              to="/"
              className={`${buttonVariants({ variant: 'tertiary', size: 'sm' })} shrink-0 whitespace-nowrap`}
            >
              <IconArrowLeft className="h-4 w-4" />
              All Tools
            </Link>

            <Separator orientation="vertical" className="hidden h-5 sm:block" />

            <p className="min-w-0 max-w-[min(100%,18rem)] truncate text-sm font-semibold text-foreground sm:max-w-xs sm:text-base md:max-w-md">
              {title}
            </p>
          </Toolbar>
        </div>

        <Toolbar isAttached aria-label="Tool page settings" className="shrink-0 px-2">
          <ThemeToggle />
        </Toolbar>
      </div>
    </header>
  )
}
