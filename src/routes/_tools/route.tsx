import { Outlet, createFileRoute } from '@tanstack/react-router'
import Header from '#/components/Header'

export const Route = createFileRoute('/_tools')({
  component: ToolLayout,
})

function ToolLayout() {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}