import { Button, ButtonGroup, Separator, Toolbar } from '@heroui/react'
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

        <Toolbar aria-label="Site controls">
          <ButtonGroup variant="tertiary">
            <Button
              isIconOnly
              aria-label="Home"
              render={(props: any) => <Link {...props} to="/" />}
            >
              <IconHome />
            </Button>
          </ButtonGroup>
          <Separator />
          <ThemeToggle />
          <Separator />
          <ButtonGroup variant="tertiary">
            <Button
              isIconOnly
              aria-label="GitHub"
              render={(props: any) => (
                <a {...props} href="https://github.com/pavi2410" target="_blank" rel="noreferrer" />
              )}
            >
              <IconBrandGithub />
            </Button>
            <Button
              isIconOnly
              aria-label="X"
              render={(props: any) => (
                <a {...props} href="https://x.com/pavi2410" target="_blank" rel="noreferrer" />
              )}
            >
              <ButtonGroup.Separator />
              <IconBrandX />
            </Button>
          </ButtonGroup>
        </Toolbar>
      </div>
    </header>
  )
}
