export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/70">&copy; {year} pavi2410</p>
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
        </div>
      </div>
    </footer>
  )
}
