export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-4 py-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <p className="text-sm text-muted">&copy; {year} pavi2410</p>
        <div className="flex items-center gap-4">
          <a
            href="https://x.com/pavi2410"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted no-underline hover:text-foreground"
          >
            X
          </a>
          <a
            href="https://github.com/pavi2410"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted no-underline hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
