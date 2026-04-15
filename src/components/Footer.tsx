export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-4 py-6">
      <div className="mx-auto flex w-full max-w-400 items-center justify-between">
        <p className="text-sm text-muted">&copy; {year} Toolkit</p>
      </div>
    </footer>
  )
}
