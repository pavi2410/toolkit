import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur px-4 py-3">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <Link to="/" className="text-lg font-semibold no-underline">
          Toolkit
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="https://x.com/pavi2410"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-foreground/70 no-underline hover:text-foreground"
          >
            X
          </a>
          <a
            href="https://github.com/pavi2410"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-foreground/70 no-underline hover:text-foreground"
          >
            GitHub
          </a>
              <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
