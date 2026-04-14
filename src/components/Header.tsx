import { Separator, Toolbar } from '@heroui/react'
import { buttonVariants } from '@heroui/styles'
import { Link } from '@tanstack/react-router'
import IconBrandGithub from '~icons/tabler/brand-github'
import IconBrandX from '~icons/tabler/brand-x'
import IconHome from '~icons/tabler/home'
import IconTools from '~icons/tabler/tools'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-2">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <IconTools className="h-5 w-5 text-accent" />
          <span className="font-display text-lg font-bold text-foreground">Toolkit</span>
        </Link>

        <Toolbar aria-label="Site controls" className="flex items-center gap-1">
          <Link
            to="/"
            aria-label="Home"
            className={buttonVariants({ variant: 'tertiary', size: 'sm', isIconOnly: true })}
          >
            <IconHome className="w-4 h-4" />
          </Link>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <ThemeToggle />

          <Separator orientation="vertical" className="h-5 mx-1" />

          <a
            href="https://github.com/pavi2410"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={buttonVariants({ variant: 'tertiary', size: 'sm', isIconOnly: true })}
          >
            <IconBrandGithub className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/pavi2410"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            className={buttonVariants({ variant: 'tertiary', size: 'sm', isIconOnly: true })}
          >
            <IconBrandX className="w-4 h-4" />
          </a>
        </Toolbar>
      </div>
    </header>
  )
}
